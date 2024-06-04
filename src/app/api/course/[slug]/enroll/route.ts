import { JWT_SECRET } from "@/constants/config.constants";
import { courseService } from "@/services/course.service";
import { userService } from "@/services/user.service";
import { db } from "@/utils/pg-driver.utils";
import { HttpResponse } from "@/utils/responseHandler.utils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


interface IParams {
    slug: string
}

const httpResponse = new HttpResponse();

//endpoint: /api/course/{courseId}/enroll
export async function POST(req: NextRequest, context: { params: IParams }) {
    try {
        // const demoEmail = 'uddiptagogoi2000@gmail.com' //decoded?.email!
        const decoded = await getToken({ req, secret: JWT_SECRET });
        console.log("inside course enroll", decoded)
        if (!decoded?.email) {
            return httpResponse.unauthorize()
        }
        const userId = await userService.getIdByEmail(decoded?.email);//!later use decoded.email
        const courseId = Number(context.params.slug);

        if (!userId) {
            throw new Error('User not found')
        }

        //find if the user is already enrolled in the course 
        const isUserAlreadyEnrolled = await courseService.isUserAlreadyEnrolled(courseId, userId);
        if (isUserAlreadyEnrolled) {
            return NextResponse.json({ message: 'You have already enrolled to this course.' })
        }

        await courseService.enrollToCourse(courseId, userId);
        return NextResponse.json({ message: 'Enrolled successfully to the course' })
    } catch (error) {
        console.error(error)
    }
}

