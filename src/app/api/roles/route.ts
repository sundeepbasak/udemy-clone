import { roleService } from "@/services/role.service";
import { NewRole } from "@/types/database.types";
import { db } from "@/utils/pg-driver.utils";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
    try {
        const roles = await roleService.getAllRoles();
        if (!roles) {
            return NextResponse.json({ data: [] })
        }
        return NextResponse.json({ data: roles })
    } catch (error) {
        console.error(error)
    }
}

export async function POST(req: Request, res: Response) {
    try {
        const requestData: NewRole = await req.json();
        const result = await roleService.createRole(requestData);

        return NextResponse.json({ data: result, msg: "role created successfully" })
    } catch (error) {
        console.error("new role creation error", error)
    }
}