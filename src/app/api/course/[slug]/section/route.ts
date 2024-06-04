import { IContents, sectionService } from "@/services/section.service";
import { NewSection } from "@/types/database.types";
import { db } from "@/utils/pg-driver.utils";
import { NextRequest, NextResponse } from "next/server";

//api endpoint: /api/course/{courseId}/section

interface IParams {
    slug: string
}

export async function GET(req: NextRequest, context: { params: IParams }) {
    try {
        // const courseId = Number(url.searchParams.get('cid'));
        const courseId = Number(context.params.slug);

        const url = new URL(req.nextUrl);
        const isEditable = url.searchParams.get('edit') === 'true' ? true : false;

        let course_contents: IContents[] | undefined = [];
        if (isEditable) {
            const course_contentss = await sectionService.getSectionVideosEditable(courseId);
            return NextResponse.json({ data: course_contentss })
        }
        course_contents = await sectionService.getSectionVideos(courseId);
        return NextResponse.json({ data: course_contents })
    } catch (error) {
        console.error(error)
    }
}

export async function POST(req: NextRequest, context: { params: IParams }) {
    try {
        const requestData: NewSection = await req.json();
        const courseId = Number(context.params.slug);

        const section = await sectionService.createSection(courseId, requestData);
        return NextResponse.json({ message: 'section created successfully', data: section })
    } catch (error) {
        console.error(error)
    }


}


/* 
to get query params:
const url = new URL(req.nextUrl);
const courseId = Number(url.searchParams.get('cid'));

*/