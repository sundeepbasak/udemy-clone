import { UpdateCategory } from "@/types/database.types";
import { RdsClientV2 } from "@/utils/RdsClient";
import { prepareStatement } from "@/utils/prepareSQL.utils";

import { db } from '@/utils/database-driver.utils'


const rds = new RdsClientV2();

class CategoryService {
  async createCategory(name: string) {
    try {
      console.log('create category hit')
      const { sql, parameters } = db.insertInto('misc_db.category').values({
        name: name,
      })
        .returning(['id', 'name'])
        .compile();

      const paramsObj = { name };

      const query = prepareStatement(sql, ['name']);
      const [result, error] = await rds.queryOne<typeof paramsObj, { id: number; name: string }>({
        sql: query,
        params: { name }
      });

      if (error) {
        throw new Error("Error quering creating category" + error.message + error.stack)
      }

      return result?.data
      // return category
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllCategories() {
    try {
      const { sql } = await db.selectFrom('misc_db.category').select(['id', 'name']).compile();

      const query = prepareStatement(sql)
      const [result, error] = await rds.query({
        sql: query,
        params: {}
      })

      if (error !== null) {
        throw new Error("Error quering get all categories" + error.message + error.stack)
      }
      return result.data;
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async editCategory(catId: number, body: UpdateCategory) {
    try {
      const { sql } = await db.updateTable('misc_db.category')
        .set({
          name: body.name
        })
        .where('id', '=', catId)
        .compile();

      const query = prepareStatement(sql, ['name', 'id'])
      const [result, error] = await rds.queryOne<{ id: number; name: string }, {}>({
        sql: query,
        params: { name: body.name!, id: catId }
      })

      if (error !== null) {
        throw new Error("Error quering edit category" + error.message + error.stack)
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async deleteCategory(catId: number) {
    try {
      const { sql } = await db.deleteFrom('misc_db.category').where('id', '=', catId).compile();

      const query = prepareStatement(sql, ['id'])
      const [result, error] = await rds.queryOne<{ id: number }, {}>({
        sql: query,
        params: { id: catId }
      });

      if (error !== null) {
        throw new Error("Error quering delete category" + error.message + error.stack)
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  //get all sub-categories of a category
  async getSubCategoriesByCategoryId(catId: number) {
    try {
      const { sql } = await db.selectFrom('misc_db.sub_category').selectAll().where('category_id', '=', catId).compile();

      const query = prepareStatement(sql, ['category_id'])
      const [result, error] = await rds.query<{ category_id: number }, {}>({
        sql: query,
        params: { category_id: catId }
      });

      if (error !== null) {
        throw new Error("Error quering get subCategories by categoryId" + error.message + error.stack)
      }
      return result.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}


export const categoryService = new CategoryService();