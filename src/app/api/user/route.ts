import { userService } from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

//api/user

//api/user?isActive=boolean
export async function GET(req: NextRequest) {
    try {
        // const url = new URL(req.nextUrl);
        // const isActive = url.searchParams.get('isActive') === 'false' ? false : true;

        const isActive = true;
        const users = await userService.getUsers(isActive);
        if (!users) {
            return NextResponse.json({ data: [] })
        }
        return NextResponse.json({ data: users })
    } catch (error) {
        console.error(error)
    }
}

