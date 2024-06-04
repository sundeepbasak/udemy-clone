import { courseService } from "@/services/course.service";
import { NextRequest, NextResponse } from "next/server";

//api endpoint: /api/course/popular
export async function GET(req: NextRequest) {
    try {
        const courses = await courseService.getPopularCourses();
        if (!courses) {
            return NextResponse.json({ data: [] })
        }
        return NextResponse.json({ data: courses })
    } catch (error) {
        console.error(error)
    }
}