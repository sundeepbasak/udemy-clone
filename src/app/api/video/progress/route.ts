import { JWT_SECRET } from "@/constants/config.constants";
import { videoService } from "@/services/video.service";
import { UpdateWatchHistory } from "@/types/database.types";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export interface IProgress {
    progress: number;
    completed: boolean;
    last_watched_at: string;
    section_id: number;
    course_id: number
}

//endpoint: /api/video/progress?cid=2 or ?cid=2&vid=23
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const courseId = url.searchParams.get("cid")!;
        const videoId = url.searchParams.get("vid");
        // const decoded = await getToken({ req, secret: JWT_SECRET });
        const userId = 1; //!make it dynamic

        const result = await videoService.getVideoProgress(userId, Number(courseId), Number(videoId));
        return NextResponse.json({ data: result })
    } catch (error: any) {
        throw new Error(error.message)
    }
}

//endpoint: /api/video/progress?vid=21 and body
export async function PATCH(req: NextRequest) {
    try {
        const requestData: IProgress = await req.json();
        const url = new URL(req.url);
        const videoId = url.searchParams.get("vid")!;
        // const decoded = await getToken({ req, secret: JWT_SECRET });
        const userId = 1; //!make it dynamic

        await videoService.updateVideoProgress(userId, Number(videoId), requestData)
        return NextResponse.json({ data: [] })
    } catch (error: any) {
        throw new Error(error.message)
    }
}