import { NewRole, PermissionMatrix, UpdateRole } from "@/types/database.types";
import { RdsClientV2 } from "@/utils/RdsClient";
import { db } from "@/utils/database-driver.utils";

const rds = new RdsClientV2()

class RoleService {
    async createRole(body: NewRole) {
        try {
            const { name, permission_matrix } = body;
            const queryExpr = db.insertInto('misc_db.roles').values({
                name: name,
                permission_matrix
            }).returning(['id', 'name', 'permission_matrix']);

            const rows = queryExpr.executeTakeFirst();
            type ResultType = Awaited<typeof rows>;
            const { sql, parameters } = await queryExpr.compile()

            const [result, error] = await rds.queryOne<{ name: string, permission_matrix: PermissionMatrix }, ResultType>({
                sql: sql,
                params: { name, permission_matrix }
            }, parameters);

            if (error !== null) {
                throw new Error("Error quering creating sub-category" + error.message + error.stack)
            }
            return result.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async getAllRoles() {
        try {
            const queryExpr = db.selectFrom('misc_db.roles').selectAll();

            const rows = queryExpr.execute();
            type ResultType = Awaited<typeof rows>;

            const { sql, parameters } = await queryExpr.compile()
            const [result, error] = await rds.query<{}, ResultType>({
                sql: sql,
                params: {}
            });

            if (error !== null) {
                throw new Error("Error quering getting all roles" + error.message + error.stack)
            }
            return result.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async getRole(roleId: number) {
        try {
            const queryExpr = db.selectFrom('misc_db.roles').selectAll().where('id', '=', roleId);

            const rows = queryExpr.execute();
            type ResultType = Awaited<typeof rows>;

            const { sql, parameters } = await queryExpr.compile()
            const [result, error] = await rds.queryOne<{ id: number }, ResultType>({
                sql: sql,
                params: { id: roleId }
            }, parameters);

            if (error !== null) {
                throw new Error("Error quering get role by id" + error.message + error.stack)
            }
            return result.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async updateRole(roleId: number, body: UpdateRole) {
        try {
            const { name, permission_matrix } = body;
            if (!name || !permission_matrix) {
                throw new Error('name and permission matrix are required fields.')
            }

            const queryExpr = db.updateTable('misc_db.roles').set({
                name,
                permission_matrix
            }).where('id', '=', roleId).returningAll();

            const rows = queryExpr.execute();
            type ResultType = Awaited<typeof rows>;

            const { sql, parameters } = await queryExpr.compile()
            const [result, error] = await rds.queryOne<{
                name: string, permission_matrix: PermissionMatrix, id: number
            }, ResultType>({
                sql: sql,
                params: { name, permission_matrix, id: roleId }
            }, parameters);

            if (error !== null) {
                throw new Error("Error quering update role by id" + error.message + error.stack)
            }

            return result.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async deleteRole(roleId: number) {
        try {
            const queryExpr = db.deleteFrom('misc_db.roles').where('id', '=', roleId).returning('id');

            const rows = queryExpr.executeTakeFirst();
            type ResultType = Awaited<typeof rows>;
            const { sql, parameters } = await queryExpr.compile();

            const [result, error] = await rds.queryOne<{
                id: number
            }, ResultType>({
                sql: sql,
                params: { id: roleId }
            }, parameters);

            if (error !== null) {
                throw new Error("Error quering delete role by id" + error.message + error.stack)
            }
            return result.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async getPermissions(roleId: number) {
        try {
            const queryExpr =
                db.selectFrom('misc_db.roles')
                    .select('permission_matrix')
                    .where('id', '=', roleId);

            const rows = queryExpr.execute();
            type ResultType = Awaited<typeof rows>;

            const { sql, parameters } = await queryExpr.compile()
            const [result, error] = await rds.queryOne<{
                id: number
            }, ResultType>({
                sql: sql,
                params: { id: roleId }
            }, parameters);

            if (error !== null) {
                throw new Error("Error quering getting permissions by id" + error.message + error.stack)
            }
            return result.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}


export const roleService = new RoleService();