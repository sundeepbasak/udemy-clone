import { courseService } from "@/services/course.service";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    try {
        const result = await courseService.getNewReleases();
        if (!result) {
            return NextResponse.json({ data: [] })
        }
        return NextResponse.json({ data: result })
    } catch (error: any) {
        throw new Error(error.message)
    }
}