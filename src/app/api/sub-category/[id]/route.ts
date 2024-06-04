import { subCategoryService } from "@/services/sub-category.service";
import { IRouteParams } from "@/interfaces/api.interface";
import { UpdateSubCategory } from "@/types/database.types";
import { NextRequest, NextResponse } from "next/server";

//endpoint: /api/sub-category/{subCategoryId}

export async function PATCH(req: NextRequest, context: { params: IRouteParams }) {
    try {
        const subCatId = Number(context.params.id);
        const requestData: UpdateSubCategory = await req.json();

        await subCategoryService.editSubCategory(subCatId, requestData);

        return NextResponse.json({ msg: 'sub-category updated successfully!!' })
    } catch (error) {
        console.error(error)
    }
}

export async function DELETE(req: NextRequest, context: { params: IRouteParams }) {
    try {
        const subCatId = Number(context.params.id);
        await subCategoryService.deleteSubCategory(subCatId);
        return NextResponse.json({ msg: 'sub-category deleted successfully!!' })
    } catch (error) {
        console.error(error)
    }
}