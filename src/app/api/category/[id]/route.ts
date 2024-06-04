import { categoryService } from "@/services/category.service";
import { ICategoryParams } from "@/interfaces/api.interface";
import { UpdateCategory } from "@/types/database.types";
import { NextRequest, NextResponse } from "next/server";
import { HttpResponse } from "@/utils/responseHandler.utils";

//endpoint: /api/category/{categoryId}
const httpResponse = new HttpResponse()

export async function PATCH(req: NextRequest, context: { params: ICategoryParams }) {
    try {
        // const categoryId = Number(context.params.id);
        // const requestData: UpdateCategory = await req.json();

        // await categoryService.editCategory(categoryId, requestData);
        return httpResponse.success('Category updated successfully!!');
    } catch (error: any) {
        console.log(error.message)
        return httpResponse.internalServerError(error.message)
    }
}

export async function DELETE(req: NextRequest, context: { params: ICategoryParams }) {
    try {
        const categoryId = Number(context.params.id);
        await categoryService.deleteCategory(categoryId);
        return httpResponse.success('Category deleted successfully!!');
    } catch (error: any) {
        console.log(error.message)
        return httpResponse.internalServerError(error.message)
    }
}