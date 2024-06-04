import { ICourseParams, IRouteParams } from "@/interfaces/api.interface";
import { videoService } from "@/services/video.service";
import { HttpResponse } from "@/utils/responseHandler.utils";
import { NextRequest, NextResponse } from "next/server";

export interface ICompleteVideo {
    video_id: number
}

const httpResponse = new HttpResponse()

//api endpoint: /api/course/:courseId/complete and body
export async function POST(req: NextRequest, context: { params: ICourseParams }) {
    try {
        const courseId = Number(context.params.slug);
        const requestData: ICompleteVideo = await req.json();
        const userId = 1; //!make it dynamic
        const result = await videoService.markVideoAsComplete(userId, courseId, requestData);
        if (!result?.id) {
            return httpResponse.internalServerError()
        }
        return httpResponse.success(result.id)
    } catch (error: any) {
        throw new Error(error.message)
    }
}