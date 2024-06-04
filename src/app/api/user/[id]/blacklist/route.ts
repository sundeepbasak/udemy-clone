import { IRouteParams } from "@/interfaces/api.interface";
import { userService } from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

//api/user/{userId}/blacklist?blacklist=boolean

export async function OPTIONS(req: NextRequest) {
    console.log("hit options blacklist")
    return new Response('Hello World!!', {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        status: 200
    }
    )
}

export async function PATCH(req: NextRequest, context: { params: IRouteParams }) {
    try {
        console.log("hit blacklist")
        const userId = Number(context.params.id);
        const url = new URL(req.nextUrl);
        const blackList = url.searchParams.get('blacklist') === 'false' ? true : false;

        await userService.blackListUser(userId, blackList);
        return NextResponse.json({ msg: 'Deactivated user successfully!!' })
    } catch (error) {
        console.error(error)
    }
}