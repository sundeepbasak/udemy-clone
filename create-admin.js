// import { db } from "./src/utils/pg-driver.utils.js";
const { db } = require('./src/utils/pg-driver.utils.js');
const bcrypt = require('bcrypt');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const createAdminUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await db.transaction().execute(async (trx) => {
      //get admin role id
      const defaultRole = await trx
        .selectFrom('roles')
        .select('id')
        .where('name', '=', 'admin')
        .executeTakeFirstOrThrow();

      const admin = await trx
        .insertInto('user')
        .values({
          fullname: 'Admin',
          email: ADMIN_EMAIL,
          password: hashedPassword,
          is_verified: true,
        })
        .returning('id')
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('user_roles')
        .values({
          user_id: admin.id,
          role_id: defaultRole.id,
        })
        .executeTakeFirst();
    });

    console.log('admin created successfuly!!');
  } catch (error) {
    console.error(error);
  }
};

createAdminUser();
