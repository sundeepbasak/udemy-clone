import { userService } from "@/services/user.service";
import { HttpResponse } from "@/utils/responseHandler.utils";

export async function POST(req: Request, res: Response) {
    try {
        const requestData = await req.json();
        const { token, password } = requestData;

        await userService.verifyEmail();
        return new HttpResponse().success('Email verified successfully!!')
    } catch (error: any) {
        return new HttpResponse().internalServerError(error.message)
    }
}