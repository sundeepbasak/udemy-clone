import { categoryService } from "@/services/category.service";
import { db } from "@/utils/pg-driver.utils";
import { NextResponse } from "next/server";

//endpoint: /api/category/{categoryId}/sub-category

interface IParams {
    id: number
}

export async function GET(req: Request, context: { params: IParams }) {
    try {
        const categoryId = Number(context.params.id);

        //get all sub-categories of a category
        const subCategories = await categoryService.getSubCategoriesByCategoryId(categoryId);
        if (!subCategories) {
            return NextResponse.json({ data: [] })
        }
        return NextResponse.json({ data: subCategories })
    } catch (error) {
        console.error(error)
    }
}