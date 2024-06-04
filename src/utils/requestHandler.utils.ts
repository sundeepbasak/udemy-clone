import { Resource, permissionGuard } from "@/middlewares/roles.middlewares"
import { userService } from "@/services/user.service"
import { RdsClientV2 } from "./RdsClient"

export type REQUEST = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'

const MethodOperationMap: Record<REQUEST, string> = {
    GET: "read",
    POST: "create",
    PATCH: "update",
    PUT: "update",
    DELETE: 'delete'
}

function checkPermission() {

}

const rds = new RdsClientV2();

export async function requestHandler(requestMethod: REQUEST, resource: Resource, userId: number): Promise<boolean> {
    if (requestMethod === 'GET') {
        console.log("category hit GET")
        return true
    }

    if (requestMethod === 'POST') {
        console.log("category hit POST");

        // const isAllowed = permissionGuard({ resource, permission: 'create' });
        // if (!isAllowed) {
        //     return false;
        // }

        // const [result, error] = await rds.queryOne({
        //     sql: `select * from misc_db."user"`,
        //     params: {}
        // })
        // if (error !== null) {
        //     throw new Error(error.message)
        // }

        // console.log(result.data)
        return true;
    }

    if (requestMethod === 'PATCH') {
        console.log("category hit PATCH")
        return true
    }

    if (requestMethod === 'DELETE') {
        console.log("category hit DELETE")
        return true
    }
    return false
}