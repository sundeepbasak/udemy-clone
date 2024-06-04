import { IRouteParams } from "@/interfaces/api.interface";
import { videoService } from "@/services/video.service";
import { HttpResponse } from "@/utils/responseHandler.utils";
import { NextRequest } from "next/server";

//api endpoint: /api/video/:videoId
const httpResponse = new HttpResponse()

export async function GET(req: NextRequest, context: { params: IRouteParams }) {
    try {
        const videoId = Number(context.params.id);
        const result = await videoService.getVideo(videoId);
        return httpResponse.success(result);
    } catch (error: any) {
        throw new Error(error.message)
    }
}