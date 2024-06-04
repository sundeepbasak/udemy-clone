

//api endpoint: /api/course/{courseId}/section/{sectionId}/video/{videoId}

import { videoService } from "@/services/video.service";
import { ISectionParams, IVideoParams } from "@/interfaces/api.interface";
import { UpdateVideo } from "@/types/database.types";
import { NextRequest, NextResponse } from "next/server";


//get video
export async function GET(req: NextRequest, context: { params: IVideoParams }) {
    try {
        const videoId = Number(context.params.vid);
        const video = await videoService.getVideo(videoId);
        if (!video) {
            return NextResponse.json({ msg: 'No video found!!' })
        }
        return NextResponse.json({ data: video })
    } catch (error) {
        console.error(error)
    }
}

//edit video
export async function PATCH(req: NextRequest, context: { params: IVideoParams }) {
    try {
        const videoId = Number(context.params.vid);
        const requestData: UpdateVideo = await req.json();

        const result = await videoService.editVideo(videoId, requestData);
        if (!result) {
            throw new Error('error in updation of video')
        }
        return NextResponse.json({ message: `video updated successfully with id: ${result?.id}` })
    } catch (error) {
        console.error(error)
    }

}

//delete video
export async function DELETE(req: NextRequest, context: { params: IVideoParams }) {
    try {
        const videoId = Number(context.params.vid);
        const result = await videoService.deleteVideo(videoId);
        return NextResponse.json({ message: `video deleted successfully with id: ${result?.id}` })
    } catch (error) {
        console.error(error)
    }
}