import { subCategoryService } from "@/services/sub-category.service";
import { NewSubCategory } from "@/types/database.types";
import { db } from "@/utils/pg-driver.utils";
import { NextRequest, NextResponse } from "next/server";

//endpoint: /api/sub-category

export async function GET(req: NextRequest) {
    try {
        const subCategories = await subCategoryService.getAllSubCategories();
        if (!subCategories) {
            return NextResponse.json({ data: [] })
        }
        return NextResponse.json({ data: subCategories })
    } catch (error) {
        console.error(error)
    }
}

export async function POST(req: Request, res: Response) {
    try {
        const requestData: NewSubCategory = await req.json();
        const subCategory = await subCategoryService.createSubCategory(requestData)
        return NextResponse.json({ data: subCategory })
    } catch (error) {
        console.error(error)
    }
}