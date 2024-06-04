import { videoService } from "@/services/video.service";
import { ISectionParams, IVideoParams } from "@/interfaces/api.interface";
import { NewVideo, UpdateVideo } from "@/types/database.types";
import { NextRequest, NextResponse } from "next/server";

//api endpoint: /api/course/{courseId}/section/{sectionId}/video

//create video
export async function POST(req: NextRequest, context: { params: ISectionParams }) {
    try {
        const sectionId = Number(context.params.sid);
        const requestData: NewVideo = await req.json()

        const video = await videoService.createVideo(sectionId, requestData);
        return NextResponse.json({ data: video })
    } catch (error) {
        console.error(error)
    }
}

export async function GET(req: NextRequest) {
    try {
        return NextResponse.json({ msg: 'get video' })
    } catch (error) {

    }
}