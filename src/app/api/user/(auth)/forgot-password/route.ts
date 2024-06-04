import { userService } from "@/services/user.service";
import { HttpResponse } from "@/utils/responseHandler.utils";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
    try {
        const requestData = await req.json();
        const { email } = requestData;

        await userService.forgotPassword(email);
        // return successResponse('Reset password mail sent successfully!!')
        return new HttpResponse().success('Reset password mail sent successfully!!')
    } catch (error: any) {
        return new HttpResponse().notFound('User not Found');
    }
}