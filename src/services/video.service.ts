import {
  NewVideo,
  NewWatchHistory,
  UpdateVideo,
  UpdateWatchHistory,
} from '@/types/database.types'
import { RdsClientV2 } from '@/utils/RdsClient'
import { db } from '@/utils/database-driver.utils'
import { getCacheKey } from '@/utils/getCacheKey.utils'
import { redis } from '@/utils/redis.utils'
import { fileService } from './file.service'
import { IProgress } from '@/app/api/video/progress/route'
import { ICompleteVideo } from '@/app/api/course/[slug]/complete/route'

export interface IVideoProgress {
  user_id: number
  video_id: number
  progress: number
  completed: boolean
  last_watched_at: string
  section_id: number
}

const rds = new RdsClientV2()

class VideoService {
  async createVideo(sectionId: number, body: NewVideo) {
    try {
      const { title, url, order, previewable = false } = body
      if (!title || !url) {
        throw new Error('Video fields are required!!')
      }

      const queryExpr = db
        .insertInto('misc_db.video')
        .values({
          title,
          previewable,
          url,
          section_id: sectionId,
          order,
        })
        .returning(['id', 'title', 'previewable', 'url', 'order'])

      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>
      const { sql, parameters } = await queryExpr.compile()

      const [result, error] = await rds.queryOne<
        {
          title: string
          previewable: boolean
          url: string
          section_id: number
          order: number
        },
        ResultType
      >(
        {
          sql: sql,
          params: { title, previewable, url, section_id: sectionId, order },
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering creating video' + error.message + error.stack
        )
      }
      return result.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async getVideos() {}

  async getVideo(videoId: number) {
    try {
      const queryExpr = db
        .selectFrom('misc_db.video')
        .select(['id', 'title', 'url', 'section_id'])
        .where('id', '=', videoId)

      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>
      const { sql, parameters } = await queryExpr.compile()

      const [result, error] = await rds.queryOne<
        {
          id: number
        },
        ResultType
      >(
        {
          sql: sql,
          params: { id: videoId },
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering get video by videoId' + error.message + error.stack
        )
      }

      if (!result.data) {
        throw new Error(`Video doesn't exist`)
      }

      // const { url } = await fileService.getPresignedUrlForDownload(result.data.url);
      // return
      return result.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async editVideo(videoId: number, body: UpdateVideo) {
    try {
      const { url, title, previewable } = body
      if (!title || !url || !previewable) {
        throw new Error('title, url and previewable are required fields')
      }

      const queryExpr = db
        .updateTable('misc_db.video')
        .set({
          title,
          url,
          previewable,
        })
        .where('id', '=', videoId)
        .returning('id')

      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>
      const { sql, parameters } = await queryExpr.compile()

      const [result, error] = await rds.queryOne<
        {
          title: string
          url: string
          previewable: boolean
          id: number
        },
        { id: number }
      >(
        {
          sql,
          params: { title, url, previewable, id: videoId },
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering getting edit video' + error.message + error.stack
        )
      }
      return result.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async deleteVideo(videoId: number) {
    try {
      const queryExpr = db
        .deleteFrom('misc_db.video')
        .where('id', '=', videoId)
        .returning('id')

      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>
      const { sql, parameters } = await queryExpr.compile()

      const [result, error] = await rds.queryOne<
        {
          id: number
        },
        ResultType
      >(
        {
          sql: sql,
          params: { id: videoId },
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering getting deleting video' + error.message + error.stack
        )
      }
      return result.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  //helper function to read progress data from the db
  async getProgressFromDB(userId: number, videoId: number) {
    try {
      const queryExpr = db
        .selectFrom('misc_db.watch_history')
        .select([
          'user_id',
          'video_id',
          'completed',
          'progress',
          'last_watched_at',
          'course_id',
        ])
        .where('user_id', '=', userId)
        .where('video_id', '=', videoId)

      const paramsObj = { userId, videoId }
      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>
      const { sql, parameters } = await queryExpr.compile()

      const [result, error] = await rds.queryOne<typeof paramsObj, ResultType>(
        {
          sql: sql,
          params: paramsObj,
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering getting progress from db' + error.message + error.stack
        )
      }
      return result.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  //helper function to write progress data from the db
  async writeProgressToDB(videoProgress: NewWatchHistory) {
    try {
      console.log('write progress to db hit')
      const {
        user_id,
        course_id,
        video_id,
        progress,
        completed,
        last_watched_at,
      } = videoProgress
      const queryExpr = db.insertInto('misc_db.watch_history').values({
        user_id,
        video_id,
        course_id,
        progress,
        completed,
        last_watched_at,
      })

      const paramsObj = {
        user_id,
        course_id,
        video_id,
        progress,
        completed,
        last_watched_at,
      }
      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>
      const { sql, parameters } = await queryExpr.compile()

      const [result, error] = await rds.queryOne<typeof paramsObj, ResultType>(
        {
          sql: sql,
          params: paramsObj,
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering writing progress to db' + error.message + error.stack
        )
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  //cleanup the keys from redis
  // async

  //api/video/progress?cid=21
  async getVideoProgress(userId: number, videoId: number, courseId: number) {
    try {
      console.log('inside get video progress')
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  //api/video/progress?cid=2&vid=21
  async updateVideoProgress(userId: number, videoId: number, body: IProgress) {
    try {
      console.log('inside update video progress', body, { userId }, { videoId })
      const { progress, completed, last_watched_at, course_id, section_id } =
        body

      //store it in the redis cache
      const videoCacheKey = getCacheKey(userId, videoId, 'video')
      const courseCacheKey = getCacheKey(userId, course_id, 'course')

      console.log({ videoCacheKey, courseCacheKey })

      const cacheData = JSON.stringify({
        user_id: userId,
        course_id,
        section_id,
        video_id: videoId,
        progress,
        completed,
        last_watched_at,
      })

      await redis.set(videoCacheKey, cacheData)
      await redis.set(courseCacheKey, cacheData)

      console.log({ cacheData })
      return true
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async getLastWatchedVideo(userId: number, courseId: number) {
    try {
      console.log('inside last watched video')
      //first we get the video from the redis if it exists
      const cacheKey = getCacheKey(userId, courseId, 'course')
      const cachedData = await redis.get(cacheKey)
      if (cachedData) {
        const videoProgress: IVideoProgress = JSON.parse(cachedData)
        return videoProgress
      }

      // If not found in the cache, fetch the progress data from the database
      const videoProgress = await this.getLastWatchedVideoFromDB(
        userId,
        courseId
      )
      if (videoProgress) {
        //if progress is found in the db, then store it in the cache for future requests
        const updatedCacheData = JSON.stringify(videoProgress)
        await redis.set(cacheKey, updatedCacheData)
      }
      return videoProgress
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async getLastWatchedVideoFromDB(userId: number, courseId: number) {
    try {
      console.log('get last watched video from db')
      const queryExpr = db
        .selectFrom('misc_db.watch_history')
        .innerJoin(
          'misc_db.video as v',
          'v.id',
          'misc_db.watch_history.video_id'
        )
        .select([
          'user_id',
          'video_id',
          'completed',
          'progress',
          'last_watched_at',
          'course_id',
          'v.section_id',
        ])
        .where('user_id', '=', userId)
        .where('course_id', '=', courseId)
        .orderBy('last_watched_at', 'desc')
        .limit(1)

      const paramsObj = { userId, courseId, limit: 1 }
      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>
      const { sql, parameters } = await queryExpr.compile()

      const [result, error] = await rds.queryOne<typeof paramsObj, ResultType>(
        {
          sql: sql,
          params: paramsObj,
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering getting progress from db' + error.message + error.stack
        )
      }
      return result.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  //get total videos of a course
  async getTotalVideosCountOfCourse(courseId: number) {
    try {
      const queryExpr = db
        .selectFrom('misc_db.section')
        .innerJoin('misc_db.video as v', 'v.section_id', 'misc_db.section.id')
        .select((eb) => eb.fn.count('misc_db.section.id').as('total_videos'))
        .where('misc_db.section.course_id', '=', courseId)

      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>
      const { sql, parameters } = await queryExpr.compile()

      const [result, error] = await rds.queryOne<
        { courseId: number },
        ResultType
      >(
        {
          sql: sql,
          params: { courseId },
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering total videos count of course' +
            error.message +
            error.stack
        )
      }
      return result.data?.total_videos
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async getWatchedVideosCountOfCourse(userId: number, courseId: number) {
    try {
      const queryExpr = db
        .selectFrom('misc_db.watch_history')
        .select((eb) =>
          eb.fn.count('misc_db.watch_history.id').as('watched_videos')
        )
        .where('misc_db.watch_history.user_id', '=', userId)
        .where('misc_db.watch_history.course_id', '=', courseId)
        .where('misc_db.watch_history.completed', '=', true)

      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>
      const { sql, parameters } = await queryExpr.compile()

      const [result, error] = await rds.queryOne<
        { userId: number; courseId: number; completed: boolean },
        ResultType
      >(
        {
          sql: sql,
          params: { userId, courseId, completed: true },
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering watched videos count of course' +
            error.message +
            error.stack
        )
      }
      return result.data?.watched_videos
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async markVideoAsComplete(
    userId: number,
    courseId: number,
    body: ICompleteVideo
  ) {
    try {
      //first see if the video data exists in the cache:
      //if exists --> clear from the cache
      //and then write to the db

      console.log({ userId, courseId, body })
      const videoCacheKey = getCacheKey(userId, body.video_id, 'video')
      await redis.del(videoCacheKey)

      const paramsObj = {
        userId,
        courseId,
        videoId: body.video_id,
        completed: true,
        progress: 0,
        last_watched_at: new Date().toISOString(),
      }

      const [result, error] = await rds.queryOne<
        typeof paramsObj,
        { id: number }
      >({
        sql: `INSERT INTO misc_db.watch_history (user_id, course_id, video_id, progress, completed, last_watched_at)
                VALUES (:userId, :courseId, :videoId, :progress, :completed, :last_watched_at::timestamptz) returning id`,
        params: paramsObj,
      })

      if (error !== null) {
        throw new Error(
          'Error marking video as complete' + error.message + error.stack
        )
      }

      return result.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}

export const videoService = new VideoService()
