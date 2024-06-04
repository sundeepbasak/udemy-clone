import { generatePaginationData } from "@/utils/paginate.utils";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const result = generatePaginationData(array, 5);

    return NextResponse.json({ data: result })

}