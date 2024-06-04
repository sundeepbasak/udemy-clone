import { NextRequest, NextResponse } from "next/server";

export type Permission = 'create' | 'read' | 'update' | 'del';
export type Resource = 'user' | 'roles' | 'course' | 'category'

export interface IPermission {
    resource: Resource,
    permission: Permission
}

interface IOperation {
    [key: string]: boolean
}

export interface IRoutePermissions {
    [key: string]: IOperation
}



export const permissionGuard = (permObj: IPermission) => {
    return function checkRolePermission(req: any, res: NextResponse, next: any): boolean {
        const userPermissions = req.user.roles;

        console.log({ userPermissions })

        if (userPermissions.find((c: IRoutePermissions) => '*' in c)) {
            return true
        }
        else if (userPermissions.some((c: IRoutePermissions) => permObj.resource in c && c[permObj.resource][permObj.permission])) {
            return true
        }

        else {
            return false
        }
    }
}


/* 
 how to use it

 permissionGuard({
    resource:'course',
    permission : 'create'
 });

*/