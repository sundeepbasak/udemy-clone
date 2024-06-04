// import { CronJob } from "cron";
import { CronJob } from "cron";
import Redis from "ioredis";
import { RdsClientV2 } from "../utils/RdsClient";
import { NewWatchHistory } from "@/types/database.types";
import { REDIS_URL } from "@/constants/config.constants";

const rds = new RdsClientV2();

const redis = new Redis(
  REDIS_URL
);


//helper function to write progress data from the db
const writeProgressToDB = async (videoProgress: NewWatchHistory) => {
  try {
    console.log('write progress to db hit')
    const { user_id, course_id, video_id, progress, completed, last_watched_at } = videoProgress;
    // const queryExpr = db.insertInto('misc_db.watch_history').values({
    //   user_id,
    //   video_id,
    //   progress,
    //   completed,
    //   last_watched_at
    // }).onConflict((oc) => oc
    //   .columns(['user_id', 'video_id'])
    //   .doUpdateSet((eb) => ({
    //     progress: eb.ref('excluded.progress'),
    //     completed: eb.ref('excluded.completed'),
    //     last_watched_at: eb.ref('excluded.last_watched_at')
    //   }))
    // )

    const paramsObj = { user_id, course_id, video_id, progress, completed, last_watched_at }
    // const rows = queryExpr.executeTakeFirst()
    // type ResultType = Awaited<typeof rows>;
    // const { sql, parameters } = await queryExpr.compile();

    // console.log({ sql })

    // const [result, error] = await rds.queryOne<typeof paramsObj, ResultType>({
    //   sql: sql,
    //   params: { user_id, video_id, progress, completed, last_watched_at },
    //   // typeHintMap: { last_watched_at: "DATE" }
    // }, parameters);

    const [result, error] = await rds.queryOne<typeof paramsObj, {}>({
      sql: `INSERT INTO misc_db.watch_history (user_id, course_id, video_id, progress, completed, last_watched_at)
      VALUES (:user_id, :course_id, :video_id, :progress, :completed, :last_watched_at::timestamptz)
      ON CONFLICT (user_id, video_id)
      DO UPDATE SET
        course_id = EXCLUDED.course_id,
        progress = EXCLUDED.progress,
        completed = EXCLUDED.completed,
        last_watched_at = EXCLUDED.last_watched_at;
      `,
      params: { user_id, course_id, video_id, progress, completed, last_watched_at }
    })

    if (error !== null) {
      throw new Error("Error quering writing progress to db" + error.message + error.stack)
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const scheduleCronJob = async () => {
  console.log("hit cron");
  //  set up cron job for every 5 mins
  const job = new CronJob("*/5 * * * *", async () => {
    try {
      const keys = await redis.keys("user:*video:*"); // Adjust the pattern accordingly
      for (const key of keys) {
        const cacheData = await redis.get(key);
        if (cacheData) {
          const videoProgress = JSON.parse(cacheData);
          console.log(videoProgress);
          await writeProgressToDB(videoProgress);

          //After writing to the database, clean up the key from Redis
          //await redis.del(key);
        }
      }
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });
  job.start();
};

(async () => {
  await scheduleCronJob();
})()