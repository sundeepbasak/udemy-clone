import { fileService } from "@/services/file.service";
import { videoService } from "@/services/video.service";
import { NextRequest, NextResponse } from "next/server";


//api endpoint: /api/upload-files/download?key=328484209
export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const key = url.searchParams.get("key")!;

    try {
        const data = await fileService.getPresignedUrlForDownload(key);
        return NextResponse.json(data);
    } catch (error: any) {
        throw new Error(error.message)
    }
}