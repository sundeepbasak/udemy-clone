import { IRouteParams } from "@/interfaces/api.interface";
import { roleService } from "@/services/role.service";
import { UpdateRole } from "@/types/database.types";
import { db } from "@/utils/pg-driver.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: IRouteParams }) {
    try {
        const id = Number(context.params.id);
        const role = await roleService.getRole(id);
        if (!role) {
            return NextResponse.json({ message: 'No such role found' })
        }
        return NextResponse.json({ data: role })
    } catch (error) {
        console.error(error)
    }
}

export async function PATCH(req: NextRequest, context: { params: IRouteParams }) {
    try {
        const id = Number(context.params.id);
        const requestData: UpdateRole = await req.json();

        const result = await roleService.updateRole(id, requestData);
        if (!result) {
            return NextResponse.json({ message: 'Role Updation failed' })
        }
        return NextResponse.json({ data: result, msg: 'role updated successfully!!' })
    } catch (error) {
        console.error(error)
    }
}

export async function DELETE(req: NextRequest, context: { params: IRouteParams }) {
    try {
        const id = Number(context.params.id);
        const result = await roleService.deleteRole(id);
        return NextResponse.json({ data: `role with id: ${result?.id} deleted successfully!!` })
    } catch (error) {
        console.error(error)
    }
}