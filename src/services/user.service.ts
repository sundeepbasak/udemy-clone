import { ADMIN_EMAIL } from "@/constants/config.constants";
import { NodeMailerService } from "@/lib/nodemailer.lib";
import { RdsClientV2 } from "@/utils/RdsClient";
import { db } from "@/utils/database-driver.utils";
import { generateToken } from "@/utils/generateToken.utils";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUpdateProfile } from "../app/api/user/profile/route";
import { fileService } from "./file.service";
import { videoService } from "./video.service";
import { generatePaginationData } from "@/utils/paginate.utils";
import { ConvertToConcrete } from "./course.service";

const emailUser = process.env.EMAIL_APP_USER ?? "";
const emailPassword = process.env.EMAIL_APP_PASSWORD ?? "";
const mailerService = new NodeMailerService(emailUser, emailPassword)

interface IDecoded {
    user: string;
    iat: number;
    exp: number
}

const rds = new RdsClientV2()

type MoreLearningDetails = {
    current_section: number;
    last_watched_video: number;
    last_watched_video_progress: number;
    total_videos: number;
    completed_videos: number;
}


class UserService {
    //get less details: count of course_enrollments
    async getUsers(isActive: boolean) {
        try {
            const [result, error] = await rds.query<{ adminEmail: string, isActive: boolean }, {}>({
                sql: `select 
                u.id, u.fullname, u.email, u.avatar, u.is_active, 
                COUNT(ce.id) as enrolled_courses_count 
                from misc_db."user" u
                left join misc_db."course_enrollments" ce 
                on u.id = ce.user_id
                where u.email != :adminEmail and u.is_active = :isActive
                group by u.id;`,
                params: { adminEmail: ADMIN_EMAIL, isActive }
            })

            if (error !== null) {
                throw new Error("Error quering get all users" + error.message + error.stack)
            }
            return result.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    //get more details: like course enrollments and everything 
    async getUserById(userId: number) {
        try {
            const queryExpr = db.selectFrom('misc_db.user').select(['id', 'fullname', 'email', 'avatar', 'is_active']).where('id', '=', userId);

            const rows = queryExpr.executeTakeFirst();
            type ResultType = Awaited<typeof rows>;
            const { sql, parameters } = await queryExpr.compile();

            const [result, error] = await rds.queryOne<{ id: number }, ResultType>({
                sql: sql,
                params: { id: userId }
            })

            if (error !== null) {
                throw new Error("Error quering get user by id" + error.message + error.stack)
            }
            return result.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async blackListUser(userId: number, blackList: boolean) {
        try {
            const queryExpr = db.updateTable('misc_db.user').set({
                is_active: blackList
            }).where('id', '=', userId);

            const paramsObj = { blackList, userId };
            const rows = queryExpr.executeTakeFirst();
            type ResultType = Awaited<typeof rows>;
            const { sql, parameters } = await queryExpr.compile();

            const [result, error] = await rds.queryOne<typeof paramsObj, ResultType>({
                sql,
                params: { blackList, userId }
            }, parameters);
            if (error !== null) {
                throw new Error("Error quering blacklist user" + error.message + error.stack)
            }
            return result.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async deleteUser(userId: number) {
        try {
            const queryExpr = db.deleteFrom('misc_db.user').where('id', '=', userId).returning('id');
            const rows = queryExpr.executeTakeFirst();
            type ResultType = Awaited<typeof rows>;
            const { sql, parameters } = await queryExpr.compile();

            const [result, error] = await rds.queryOne<{
                id: number
            }, ResultType>({
                sql: sql,
                params: { id: userId }
            }, parameters);

            if (error !== null) {
                throw new Error("Error quering delete user by id" + error.message + error.stack)
            }
            return result.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async getMyLearning<T>(userId: number, pageNumber: number) {
        try {
            const queryExpr = db
                .selectFrom('misc_db.course_enrollments')
                .innerJoin('misc_db.course as c', 'c.id', 'misc_db.course_enrollments.course_id')
                .innerJoin('misc_db.category as cat', 'cat.id', 'c.category_id')
                .innerJoin('misc_db.sub_category as sub_cat', 'sub_cat.id', 'c.sub_category_id')
                .select(['c.id', 'c.title', 'c.course_slug', 'c.instructor', 'c.thumbnail', 'c.category_id as cat_id', 'cat.name as cat_name', 'c.sub_category_id as sub_cat_id', 'sub_cat.name as sub_cat_name'])
                .where('misc_db.course_enrollments.user_id', '=', userId);

            const paramsObj = { userId };
            const rows = queryExpr.executeTakeFirst();
            type ResultType = Awaited<typeof rows>;
            const { sql, parameters } = await queryExpr.compile()

            const [result, error] = await rds.query<typeof paramsObj, ResultType>({
                sql,
                params: { userId }
            }, parameters);

            if (error !== null) {
                throw new Error("Error quering get my learning" + error.message + error.stack)
            }

            let courses: ConvertToConcrete<ResultType & MoreLearningDetails>[] = [];
            const nonEmptyCourses = result.data?.filter((v): v is ConvertToConcrete<ResultType> => v !== undefined);

            const { batches } = generatePaginationData(nonEmptyCourses, 10);
            for (const batch of batches) {
                const { slice } = batch;
                const coursesBatch = (await Promise.allSettled(slice.map(async (v) => {
                    const { url } = await fileService.getPresignedUrlForDownload(v.thumbnail);
                    //get last watched video of each course
                    const lastWatchedVideos = await videoService.getLastWatchedVideo(userId, v.id);
                    //get total video count and watched video count of each course
                    const totalVideos = await videoService.getTotalVideosCountOfCourse(v.id);
                    const watchedVideos = await videoService.getWatchedVideosCountOfCourse(userId, v.id);

                    return {
                        ...v,
                        thumbnail: url,
                        current_section: lastWatchedVideos?.section_id ?? null,
                        last_watched_video: lastWatchedVideos?.video_id ?? null,
                        last_watched_video_progress: lastWatchedVideos?.progress ?? null,
                        total_videos: totalVideos,
                        completed_videos: watchedVideos ?? 0,
                    }
                }))).map(v => {
                    switch (v.status) {
                        case 'fulfilled':
                            return v.value;
                        case 'rejected':
                            return null
                    }
                }).filter((v): v is ConvertToConcrete<ResultType & MoreLearningDetails> => v !== null);
                courses = courses.concat(coursesBatch)
            }

            return courses;

            // for (let i = 0; i < result.data.length; i++) {
            //     //get last watched video of each course
            //     const lastWatchedVideos = await videoService.getLastWatchedVideo(userId, result.data[i]?.id!);

            //     //get total video count and watched video count of each course
            //     const totalVideos = await videoService.getTotalVideosCountOfCourse(result.data[i]?.id!);
            //     const watchedVideos = await videoService.getWatchedVideosCountOfCourse(userId, result.data[i]?.id!);

            //     const { url } = await fileService.getPresignedUrlForDownload(result?.data[i]?.thumbnail!);
            //     courses.push({
            //         ...result.data[i],
            //         thumbnail: url,
            //         last_watched_video: lastWatchedVideos?.video_id ?? null,
            //         last_watched_video_progress: lastWatchedVideos?.progress ?? null,
            //         total_videos: totalVideos,
            //         completed_videos: watchedVideos ?? 0
            //     })
            // }
            // return courses;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async getProfileDetails(email: string) {
        try {
            const queryExpr = db.selectFrom('misc_db.user').select(['fullname', 'email', 'avatar']).where('email', '=', email);
            const paramsObj = { email };
            const rows = queryExpr.executeTakeFirst();
            type ResultType = Awaited<typeof rows>;

            const { sql, parameters } = await queryExpr.compile()
            const [result, error] = await rds.queryOne<typeof paramsObj, ResultType>({
                sql,
                params: { email }
            }, parameters)

            if (error !== null) {
                throw new Error("Error quering get profile details" + error.message + error.stack)
            }
            return result.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async updateProfileDetails(email: string, body: IUpdateProfile) {
        try {
            const { fullname } = body;
            const queryExpr = db.updateTable('misc_db.user').set({
                fullname,
            }).where('email', '=', email).returning(['id', 'fullname']);

            const paramsObj = { fullname, email };
            const rows = queryExpr.executeTakeFirst();
            type ResultType = Awaited<typeof rows>;

            const { sql, parameters } = await queryExpr.compile()
            const [result, error] = await rds.queryOne<typeof paramsObj, ResultType>({
                sql,
                params: { fullname, email }
            }, parameters)

            if (error !== null) {
                throw new Error("Error quering update profile details" + error.message + error.stack)
            }
            return result.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    //get email --> when user clicks forgot password: send an email 
    async forgotPassword(email: string) {
        try {
            const userId = await this.getIdByEmail(email);
            if (!userId) {
                throw new Error('User not found')
            }

            //generate reset token with an expiration time
            const token = generateToken({ user: userId }, '10m');
            const res = await mailerService.sendEmail({
                from: emailUser,
                to: email,
                subject: "Password Reset Request",
                html: `<p>Click the link below to reset your password:</p>
               <a href="http://localhost:3000/reset-password?token=${token}">Reset Password</a>`
            })
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    //the mail link will contain: password and confirmpassword  -> reset password
    async resetPassword(token: string, password: string) {
        try {
            const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as IDecoded;
            const userId = Number(decoded.user);

            const hashedPassword = await bcrypt.hash(password, 10);

            const queryExpr = db.updateTable('misc_db.user').set({
                password: hashedPassword
            }).where('id', '=', userId);
            const rows = queryExpr.executeTakeFirst();
            const paramsObj = { hashedPassword, userId };
            type ResultType = Awaited<typeof rows>

            const { sql, parameters } = await queryExpr.compile();
            const [result, error] = await rds.queryOne<typeof paramsObj, ResultType>({
                sql,
                params: { hashedPassword, userId }
            });

            if (error !== null) {
                throw new Error("Error quering reset password" + error.message + error.stack)
            }
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async getIdByEmail(email: string) {
        try {
            const queryExpr = db.selectFrom('misc_db.user').select('id').where('email', '=', email);

            const rows = queryExpr.executeTakeFirst();
            type ResultType = Awaited<typeof rows>;
            const { sql, parameters } = await queryExpr.compile();

            const [result, error] = await rds.queryOne<{ email: string }, ResultType>({
                sql,
                params: { email }
            }, parameters)

            if (error !== null) {
                throw new Error("Error quering get id by email" + error.message + error.stack)
            }
            return result.data?.id
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    //for admin side
    async getUserDetails(userId: number) {
        try {
            const queryExpr = db.selectFrom('misc_db.user')
                .select(['id', 'fullname', 'email', 'avatar', 'is_verified', 'is_active'])
                .where('id', '=', userId);

            const rows = queryExpr.executeTakeFirst();
            type ResultType = Awaited<typeof rows>;
            const { sql, parameters } = await queryExpr.compile();

            const [result, error] = await rds.queryOne<{ userId: number }, ResultType>({
                sql,
                params: { userId }
            }, parameters)

            if (error !== null) {
                throw new Error("Error quering get user details" + error.message + error.stack)
            }

            const enrolledCourses = await this.getUserEnrolledCourses(userId);
            const discussions = await this.getUserDiscussions(userId);

            return { ...result.data, enrolledCourses, discussions }
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    //for admin side
    async getUserEnrolledCourses(userId: number) {
        try {
            console.log('get user enrolled courses', userId);
            const queryExpr = db
                .selectFrom('misc_db.course')
                .innerJoin('misc_db.course_enrollments as ce', 'ce.course_id', 'misc_db.course.id')
                .select(['misc_db.course.id', 'misc_db.course.title', 'misc_db.course.is_free', 'misc_db.course.instructor', 'misc_db.course.thumbnail'])
                .where('ce.user_id', '=', userId)

            const rows = queryExpr.executeTakeFirst();
            type ResultType = Awaited<typeof rows>;
            const paramsObj = { userId };

            const { sql, parameters } = await queryExpr.compile()
            const [result, error] = await rds.query<typeof paramsObj, ResultType>({
                sql,
                params: paramsObj
            }, parameters);

            if (error !== null) {
                throw new Error("Error quering get permissions by id" + error.message + error.stack)
            }
            return result.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async getUserDiscussions(userId: number) {
        try {
            console.log('get user discussions', userId);
            // let questions = await db.selectFrom('discussion_qns').select(['discussion_qns.id', 'discussion_qns.id'])
            return []
        } catch (error) {
            console.error("get user discussions error", error)
        }
    }

    async getPermissionsById(userId: number) {
        try {
            const queryExpr = db.selectFrom('misc_db.user_roles')
                .innerJoin('misc_db.roles', 'id', 'misc_db.user_roles.id')
                .select('misc_db.roles.permission_matrix')
                .where('misc_db.user_roles.user_id', '=', userId);

            const rows = queryExpr.executeTakeFirst();
            type ResultType = Awaited<typeof rows>;
            const { sql, parameters } = await queryExpr.compile();

            const [result, error] = await rds.queryOne<{ userId: number }, ResultType>({
                sql,
                params: { userId }
            }, parameters)

            if (error !== null) {
                throw new Error("Error quering get permissions by id" + error.message + error.stack)
            }
            return result.data?.permission_matrix
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async verifyEmail() {
        try {

        } catch (error) {

        }
    }
}

export const userService = new UserService()