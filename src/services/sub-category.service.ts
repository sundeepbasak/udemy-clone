import { Database, NewSubCategory, UpdateSubCategory } from "@/types/database.types";
import { RdsClientV2 } from "@/utils/RdsClient";
import { db } from "@/utils/database-driver.utils";
import { prepareStatement } from "@/utils/prepareSQL.utils";
import { InsertQueryBuilder, InsertResult } from "kysely";


const rds = new RdsClientV2()

class SubCategoryService {
    async createSubCategory(body: NewSubCategory) {
        try {
            const queryExpr = db
                .insertInto('misc_db.sub_category')
                .values({
                    name: body.name,
                    category_id: body.category_id
                })
                .returning(['id', 'name', 'category_id']);

            const rows = queryExpr.executeTakeFirst();
            type ResultType = Awaited<typeof rows>;

            const { sql, parameters } = await queryExpr.compile()

            const [result, error] = await rds.queryOne<{ name: string, category_id: number }, ResultType>({
                sql: sql,
                params: { name: body.name, category_id: body.category_id }
            }, parameters);

            if (error !== null) {
                throw new Error("Error quering creating sub-category" + error.message + error.stack)
            }
            return result.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async getAllSubCategories() {
        try {
            // const subCategories = await db.selectFrom('sub_category').select(['id', 'name', 'sub_category.category_id as cat_id']).execute();
            // return subCategories;

            const [result, error] = await rds.query({
                sql: `SELECT id, "name", category_id as cat_id
                      FROM misc_db.sub_category;
                    `,
                params: {}
            })

            if (error !== null) {
                throw new Error("Error quering get all subCategories" + error.message + error.stack)
            }
            return result.data;
        } catch (error) {
            console.error(error)
        }
    }

    async editSubCategory(subCatId: number, body: UpdateSubCategory) {
        try {
            // await db.updateTable('sub_category')
            //     .set({
            //         name: body.name
            //     })
            //     .where('id', '=', subCatId)
            //     .executeTakeFirst()

            const [result, error] = await rds.queryOne<{ subCatId: number; name: string }, {}>({
                sql: `UPDATE misc_db.sub_category
                      SET "name" = :name
                      WHERE id = :subCatId
                      ;
                    `,
                params: { subCatId, name: body.name! }
            })

            if (error !== null) {
                throw new Error("Error quering edit subCategory" + error.message + error.stack)
            }
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async deleteSubCategory(subCatId: number) {
        try {
            // await db.deleteFrom('sub_category')
            //     .where('id', '=', subCatId)
            //     .executeTakeFirst();

            const [result, error] = await rds.queryOne<{ subCatId: number }, {}>({
                sql: `DELETE FROM misc_db.sub_category
                      WHERE id= :subCatId
                      ;
                `,
                params: { subCatId }
            });

            if (error !== null) {
                throw new Error("Error quering delete category" + error.message + error.stack)
            }
        } catch (error) {
            console.error(error)
        }
    }
}

export const subCategoryService = new SubCategoryService()