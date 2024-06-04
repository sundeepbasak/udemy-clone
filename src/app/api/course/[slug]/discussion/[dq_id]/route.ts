import { IDiscussionParams } from "@/interfaces/api.interface";
import { discussionService } from "@/services/discussion.service";
import { UpdateDiscussionQuestion } from "@/types/database.types";
import { NextRequest, NextResponse } from "next/server";

//api endpoint: /api/course/{courseId}/discussion/{discussionId}
export async function OPTIONS(req: NextRequest) {
    console.log("hit options discussion with id")
    return new Response('Hello World!!', {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        status: 200
    }
    )
}

export async function GET(req: NextRequest, context: { params: IDiscussionParams }) {
    try {
        const courseId = Number(context.params.slug);
        const dqId = Number(context.params.dq_id);
        const discussion = await discussionService.getQuestionAndReplies(courseId, dqId);
        return NextResponse.json({ data: discussion })
    } catch (error) {
        console.error(error)
    }

}

export async function PATCH(req: NextRequest, context: { params: IDiscussionParams }) {
    try {
        console.log('edit discussion hit')
        const dqId = Number(context.params.dq_id);
        const requestData: UpdateDiscussionQuestion = await req.json();

        await discussionService.editQuestion(dqId, requestData);
        return NextResponse.json({ message: `Question updated successfully!!` })
    } catch (error) {
        console.error(error)
    }

}

export async function DELETE(req: NextRequest, context: { params: IDiscussionParams }) {
    try {
        const dqId = Number(context.params.dq_id);
        await discussionService.deleteQuestion(dqId);
        return NextResponse.json({ message: 'Question deleted successfully!!' })
    } catch (error) {
        console.error(error)
    }
}


