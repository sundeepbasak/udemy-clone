import { JWT_SECRET } from "@/constants/config.constants";
import { courseService } from "@/services/course.service";
import { userService } from "@/services/user.service";
import { db } from "@/utils/pg-driver.utils";
import { HttpResponse } from "@/utils/responseHandler.utils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface IParams {
    slug: string,
}

const httpResponse = new HttpResponse()

//endpoint: /api/course/{courseId}/enrollment-status
export async function GET(req: NextRequest, context: { params: IParams }) {
    try {
        // const demoEmail = 'uddiptagogoi2000@gmail.com' //decoded?.email!
        const decoded = await getToken({ req, secret: JWT_SECRET });
        if (!decoded?.email) {
            return httpResponse.unauthorize();
        }
        const userId = await userService.getIdByEmail(decoded?.email) //!later use decoded.email
        const courseId = Number(context.params.slug);

        if (!userId) {
            throw new Error('User not found')
        }

        //find if the user is already enrolled in the course 
        const isUserAlreadyEnrolled = await courseService.isUserAlreadyEnrolled(courseId, userId);
        if (isUserAlreadyEnrolled) {
            return NextResponse.json({ enrollment_status: true })
        }
        return NextResponse.json({ enrollment_status: false })
    } catch (error) {
        console.error(error)
    }

}