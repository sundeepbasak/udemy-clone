import { sectionService } from "@/services/section.service";
import { ISectionParams } from "@/interfaces/api.interface";
import { UpdateSection } from "@/types/database.types";
import { NextRequest, NextResponse } from "next/server";

//api endpoint: /api/course/{courseId}/section/{sectionId}

export async function GET(req: NextRequest) {
    try {

    } catch (error) {

    }
}

export async function PATCH(req: NextRequest, context: { params: ISectionParams }) {
    try {
        const sectionId = Number(context.params.sid);
        const requestData: UpdateSection = await req.json()

        const result = await sectionService.editSection(sectionId, requestData);
        if (!result) {
            throw new Error('error in updation of section')
        }
        return NextResponse.json({ message: `section updated successfully with id: ${result.id}` })
    } catch (error) {
        console.error(error)
    }
}

export async function DELETE(req: NextRequest, context: { params: ISectionParams }) {
    try {
        const sectionId = Number(context.params.sid);
        const result = await sectionService.deleteSection(sectionId);
        return NextResponse.json({ message: `section deleted successfully with id: ${result?.id}` }, { status: 200 })
    } catch (error) {
        console.error(error)
    }
}