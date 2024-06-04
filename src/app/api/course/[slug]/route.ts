import { courseService } from "@/services/course.service";
import { UpdateCourse } from "@/types/database.types";
import { db } from "@/utils/pg-driver.utils";
import { NextRequest, NextResponse } from "next/server";

//api endpoint: /api/course/{courseId} or {courseSlug}

interface IParams {
    slug: string
}

type CourseIdType = 'slug' | 'cid'
const courseIdTypeArr = ['cid', 'slug'] as CourseIdType[]

//api/course/{slug}or{id}?type={slug}or{cid}
export async function GET(req: NextRequest, context: { params: IParams }) {
    console.log('get single course hit...')

    try {
        let slug = context.params.slug; //"text" or "1"
        const queryParams = new URL(req.nextUrl).searchParams;
        const type = queryParams.get('type') as CourseIdType;

        if (!courseIdTypeArr.includes(type)) {
            return NextResponse.json({
                status: 400,
                ok: false,
                message: "Please define a proper type"
            }, { status: 400, })
        }

        if (type === 'slug') {
            const course = await courseService.getCourseBySlug(slug);
            return NextResponse.json({ data: course });
        }
        const course = await courseService.getCourseById(Number(slug));
        return NextResponse.json({ data: course });
    } catch (error) {
        console.error(error)
    }
}

export async function PATCH(req: NextRequest, context: { params: IParams }) {
    try {
        const courseId = Number(context.params.slug);
        const requestData: UpdateCourse = await req.json()
        const result = await courseService.updateCourse(courseId, requestData);
        if (!result) {
            throw new Error('unable to update the course')
        }
        return NextResponse.json({ data: result, msg: 'course updated successfully!!' })
    } catch (error) {
        console.error(error)
    }
}

export async function DELETE(req: NextRequest, context: { params: IParams }) {
    try {
        const courseId = Number(context.params.slug);
        const isCourseDeleted = await courseService.deleteCourse(courseId);
        if (!isCourseDeleted) {
            return NextResponse.json({ message: 'unable to delete the course' }, { status: 500 })
        }
        return NextResponse.json({ data: 'course deleted successfully!!' }, { status: 200 })
    } catch (error) {
        console.error(error)
    }
}