import { userService } from "@/services/user.service";
import { db } from "@/utils/pg-driver.utils";
import { HttpResponse } from "@/utils/responseHandler.utils";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const requestData = await req.json();
        const { token, password } = requestData;

        await userService.resetPassword(token, password);
        return new HttpResponse().success('Password reset successfully!!')
    } catch (error: any) {
        return new HttpResponse().internalServerError(error.message)
    }
}