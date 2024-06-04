import { JWT_SECRET } from "@/constants/config.constants";
import { courseService } from "@/services/course.service";
import { roleService } from "@/services/role.service";
import { NewCourse, PermissionMatrix } from "@/types/database.types";
import { db } from "@/utils/pg-driver.utils";
import { HttpResponse } from "@/utils/responseHandler.utils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const httpResponse = new HttpResponse()

//api endpoint: /api/course
export async function POST(req: NextRequest, res: Response) {
    console.log('create new course hit...')
    try {

        //decode the token recieved from the frontend: we will get the roleId 
        //and then by roleId we get the permission_matrix
        // const decoded = await getToken({ req, secret: JWT_SECRET }); //!make it dynamic
        // const roleId = 19 //for admin
        // const perm_matrix = await roleService.getPermissions(roleId);
        // if (!perm_matrix) {
        //     throw Error(`No permissions found for this user`)
        // }


        const perm_matrix = { course: { create: true } }
        const requestData: NewCourse = await req.json();

        if (perm_matrix.course.create) {
            const data = await courseService.createCourse(requestData);
            if (!data) {
                throw new Error('Course could not be created!!')
            }
            return NextResponse.json({ message: "course created successfully!!", data })
        } else {
            return NextResponse.json({ message: "Access Denied!!" }, { status: 403 })
        }
    } catch (error) {
        console.error(error)
    }
}

export async function GET(req: NextRequest) {
    console.log("get all courses hit...");
    const url = new URL(req.url)
    const isPublished = url.searchParams.get("isPublished") === 'false' ? false : true;
    const pageNumber = parseInt(url.searchParams.get('page') ?? "1")

    try {
        const courses = await courseService.getAllCourses(isPublished, pageNumber);
        // return NextResponse.json({ data: courses });
        return httpResponse.success(courses)
    } catch (error) {
        console.error(error)
    }
}

export async function OPTIONS(req: Request) {
    return new Response('', {
        status: 200,
    })
}

/* 

        return new Response(JSON.stringify(courses), {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        })

*/