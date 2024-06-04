
import { IDiscussionParams } from "@/interfaces/api.interface";
import { replyService } from "@/services/reply.service";
import { UpdateDiscussionReply } from "@/types/database.types";
import { NextRequest, NextResponse } from "next/server";

//api endpoint: /api/course/{courseId}/discussion/{discussionId}/replies/{replyId}
export async function OPTIONS(req: NextRequest) {
    console.log("hit options reply with id")
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

export async function PATCH(req: NextRequest, context: { params: IDiscussionParams }) {
    try {
        const replyId = Number(context.params.dr_id);
        const requestData: UpdateDiscussionReply = await req.json()

        await replyService.editReply(replyId, requestData);
        return NextResponse.json({ message: 'Reply updated successfully!!' })
    } catch (error) {
        console.error("Reply Edit Error", error)
    }
}

export async function DELETE(req: NextRequest, context: { params: IDiscussionParams }) {
    try {
        const replyId = Number(context.params.dr_id);
        await replyService.deleteReply(replyId);
        return NextResponse.json({ message: 'Reply deleted successfully!!' })
    } catch (error) {
        console.error("Reply Delete Error", error)
    }
}