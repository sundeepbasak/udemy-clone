import { NewDiscussionQuestion, UpdateDiscussionQuestion } from "@/types/database.types";
import { RdsClientV2 } from "@/utils/RdsClient";
import { replyService } from "./reply.service";

import { db } from "@/utils/database-driver.utils";

const rds = new RdsClientV2()

class DiscussionService {
    async createQuestion(body: NewDiscussionQuestion, courseId: number, userId: number) {
        try {
            const { qn_title, qn_detail } = body;

            const queryExpr = db.insertInto('misc_db.discussion_qns').values({
                course_id: courseId,
                user_id: userId,
                qn_title,
                qn_detail
            })
                .returning(['id', 'course_id', 'qn_title', 'qn_detail']);


            const rows = queryExpr.executeTakeFirst();
            type ResultType = Awaited<typeof rows>;
            const { sql, parameters } = await queryExpr.compile()
            const [result, error] = await rds.queryOne<{ course_id: number, user_id: number, qn_title: string, qn_detail: string }, ResultType>({
                sql: sql,
                params: { course_id: courseId, user_id: userId, qn_title, qn_detail: qn_detail ?? "" }
            }, parameters);

            if (error !== null) {
                throw new Error("Error quering creating discussion question" + error.message + error.stack)
            }
            return result.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async getAllQuestions(courseId: number) {
        try {
            const [result, error] = await rds.query<{ courseId: number }, {}>({
                sql: `select dq.id as id, dq.qn_title , dq.qn_detail,u.id as user_id , u.fullname,  dq.created_at , dq.updated_at  from misc_db."discussion_qns" dq 
                inner join misc_db."user" u on u.id = dq.user_id
                where dq.course_id = :courseId;`,
                params: { courseId }
            })

            if (error !== null) {
                throw new Error("Error quering get all questions by courseId" + error.message + error.stack)
            }
            return result.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async getQuestionAndReplies(courseId: number, qnId: number) {
        try {
            const [result, error] = await rds.queryOne<{ courseId: number }, {}>({
                sql: `select dq.id as id, dq.qn_title, dq.qn_detail, dq.created_at, dq.updated_at , u.fullname  from misc_db."discussion_qns" as dq
                inner join misc_db."user" as u
                on u.id = dq.user_id
                where dq.course_id = :courseId`,
                params: { courseId }
            })

            if (error !== null) {
                throw new Error("Error quering get question by qnId" + error.message + error.stack)
            }

            let replies = await replyService.getAllReplies(qnId);
            return { ...result?.data, replies }
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async editQuestion(dqId: number, body: UpdateDiscussionQuestion) {
        try {
            const { qn_detail, qn_title, } = body;
            if (!qn_title || !qn_detail) {
                throw new Error('Both title and detail are required fields!!')
            }

            const queryExpr = db.updateTable('misc_db.discussion_qns').set({
                qn_title,
                qn_detail
            })
                .where('id', '=', dqId);

            const rows = queryExpr.executeTakeFirst();
            const paramsObj = { qn_title, qn_detail, dqId }
            type ResultType = Awaited<typeof rows>;

            const { sql, parameters } = await queryExpr.compile();
            const [result, error] = await rds.queryOne<typeof paramsObj, ResultType>({
                sql,
                params: { qn_title, qn_detail, dqId }
            }, parameters);

            if (error !== null) {
                throw new Error("Error quering edit question" + error.message + error.stack)
            }
        } catch (error: any) {
            console.error("edit question error", error.message)
        }
    }

    async deleteQuestion(dqId: number) {
        try {
            db.deleteFrom('misc_db.discussion_qns').where('id', '=', dqId);

            const [result, error] = await rds.queryOne<{ dqId: number }, {}>({
                sql: `DELETE FROM misc_db.discussion_qns
                WHERE id= :dqId`,
                params: { dqId }
            })

            if (error !== null) {
                throw new Error("Error quering delete question" + error.message + error.stack)
            }
        } catch (error: any) {
            console.error("delete question error", error.message)
        }
    }
}



export const discussionService = new DiscussionService();