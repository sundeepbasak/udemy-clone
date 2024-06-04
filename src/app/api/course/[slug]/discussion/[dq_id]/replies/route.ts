import { JWT_SECRET } from "@/constants/config.constants";
import { IDiscussionParams } from "@/interfaces/api.interface";
import { replyService } from "@/services/reply.service";
import { userService } from "@/services/user.service";
import { NewDiscussionReply } from "@/types/database.types";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

//api endpoint: /api/course/{courseId}/discussion/{discussionId}/replies
//create and get replies
export async function POST(req: NextRequest, context: { params: IDiscussionParams }) {
    try {
        const qnId = Number(context.params.dq_id);
        const requestData: NewDiscussionReply = await req.json();

        const demoReplyEmail = 'sundeep@techvariable.com' //!use this later: decoded.email
        const decoded = await getToken({ req, secret: JWT_SECRET });

        const userId = await userService.getIdByEmail(demoReplyEmail);
        if (!userId) {
            throw new Error('User not found!!');
        }
        const reply = await replyService.createReply(requestData, qnId, userId);
        if (!reply) {
            return NextResponse.json({ data: [] })
        }
        return NextResponse.json({ data: reply })
    } catch (error) {

    }
}