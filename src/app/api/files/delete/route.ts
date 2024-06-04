import { fileService } from "@/services/file.service";
import { NextRequest } from "next/server";


//api/files/delete?key=238942u09u4
export async function DELETE(req: NextRequest) {
    try {
        const url = new URL(req.url)
        const key = url.searchParams.get("key")!;
        await fileService.deleteFile(key);
    } catch (error: any) {
        throw new Error(error.message)
    }
}