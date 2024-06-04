import { ICourseParams } from "@/interfaces/api.interface";
import { courseService } from "@/services/course.service";
import { db } from "@/utils/pg-driver.utils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, context: { params: ICourseParams }) {
    try {
        const courseId = Number(context.params.slug);
        await courseService.publishCourse(courseId);
        return NextResponse.json({ message: 'Course published successfully!!' })
    } catch (error: any) {
        throw new Error(error.message)
    }
}