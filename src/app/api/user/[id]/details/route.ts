import { IRouteParams } from "@/interfaces/api.interface";
import { userService } from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

//api endpoint: /api/user/{userId}/details
export async function GET(req: NextRequest, context: { params: IRouteParams }) {
    try {
        const userId = Number(context.params.id)
        const user = await userService.getUserDetails(userId);
        return NextResponse.json({ data: user })
    } catch (error) {
        console.error(error)
    }
}
