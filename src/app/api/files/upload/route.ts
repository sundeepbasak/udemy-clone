import { fileService } from "@/services/file.service";
import { NextRequest, NextResponse } from "next/server";


//api endpoint: /api/upload-files/upload?folder=course-1
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const folderName = url.searchParams.get("folder")!;

    try {
        const data = await fileService.getPresignedUrlForUpload(folderName)
        return NextResponse.json(data);
    } catch (error: any) {
        throw new Error(error.message)
    }
}