import { categoryService } from "@/services/category.service";
import { HttpResponse } from "@/utils/responseHandler.utils";
import { NextRequest, NextResponse } from "next/server";

//endpoint: /api/category
const httpResponse = new HttpResponse();

export async function GET(req: NextRequest) {
    try {
        // console.log('inside category GET', req)
        const categories = await categoryService.getAllCategories()
        return httpResponse.success(categories)
    } catch (error) {
        console.error(error)
    }
}

export async function POST(req: Request, res: Response) {
    try {
        const requestData = await req.json();
        const { name } = requestData;

        if (!name || name === '') throw new Error('Name is required');

        const category = await categoryService.createCategory(name)
        return httpResponse.created();
    } catch (error: any) {
        console.log(error.message)
        return httpResponse.internalServerError(error.message)
    }
}