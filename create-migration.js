const { writeFile } = require("fs/promises");

(async () => {
  const timestamp = Date.now();

  const contents = `
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
}

export async function down(db: Kysely<any>): Promise<void> {
}
`;

  await writeFile(
    __dirname + "/src/migrations/src/" + timestamp + ".ts",
    contents
  );
})();
