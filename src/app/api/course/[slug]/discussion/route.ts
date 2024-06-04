import { JWT_SECRET } from "@/constants/config.constants";
import { ICourseParams, IRouteParams } from "@/interfaces/api.interface";
import { discussionService } from "@/services/discussion.service";
import { userService } from "@/services/user.service";
import { NewDiscussionQuestion } from "@/types/database.types";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

//api endpoint: /api/course/{courseId}/discussion

export async function POST(req: NextRequest, context: { params: ICourseParams }) {
    try {
        const courseId = Number(context.params.slug);
        const requestData: NewDiscussionQuestion = await req.json();

        const demoEmail = 'uddiptagogoi2000@gmail.com' //!use this later: decoded.email
        const decoded = await getToken({ req, secret: JWT_SECRET });

        const userId = await userService.getIdByEmail(demoEmail);
        if (!userId) {
            throw new Error('No such user found')
        }
        const qn = await discussionService.createQuestion(requestData, courseId, userId);
        return NextResponse.json({ data: qn })
    } catch (error) {
        console.error(error)
    }
}

export async function GET(req: NextRequest, context: { params: ICourseParams }) {
    try {
        const courseId = Number(context.params.slug);

        const qns = await discussionService.getAllQuestions(courseId);
        if (!qns) {
            return NextResponse.json({ data: [] })
        }
        return NextResponse.json({ data: qns })
    } catch (error) {
        console.error(error)
    }
}