import { NewSection, UpdateSection } from '@/types/database.types'
import { RdsClientV2 } from '@/utils/RdsClient'
import { db } from '@/utils/database-driver.utils'
import { sql } from 'kysely'

interface IVideo {
  vid: number
  title: string
  vorder: number
  url: string
  completed: boolean
}

export interface IContents {
  sid: number
  title: string
  sorder: number
  videos: IVideo[]
}

// export interface ISectionVideos {
//     sid: number,
//     stitle: string,
//     sorder: number,
//     vid: number,
//     vtitle: string,
//     vurl: string,
//     vorder: number,
//     vpreview: boolean
// }

const rds = new RdsClientV2()

class SectionService {
  async createSection(courseId: number, body: NewSection) {
    try {
      const { title, description, order } = body
      const queryExpr = db
        .insertInto('misc_db.section')
        .values({
          course_id: courseId,
          title,
          description,
          order,
        })
        .returning(['id', 'title', 'description'])

      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>
      const { sql, parameters } = await queryExpr.compile()

      const [result, error] = await rds.mutateOne<
        {
          course_id: number
          title: string
          description: string
          order: number
        },
        ResultType
      >(
        {
          sql: sql,
          params: { course_id: courseId, title, description, order },
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering creating section' + error.message + error.stack
        )
      }
      return result.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async getSectionVideos(courseId: number) {
    try {
      // const queryExpr = db.selectFrom('misc_db.section')
      // .leftJoin('misc_db.video', 'misc_db.video.section_id', 'misc_db.section.id')
      // .where('misc_db.section.course_id', '=', courseId)
      //     .select(['misc_db.section.id as sid', 'misc_db.section.title as stitle', 'misc_db.section.order as sorder', 'misc_db.video.id as vid', 'misc_db.video.title as vtitle', 'misc_db.video.url as vurl', 'misc_db.video.order as vorder', 'misc_db.video.previewable as vpreview'])
      //     .orderBy('sorder', 'asc').orderBy('vorder', 'asc');

      const queryExpr = db
        .selectFrom('misc_db.section')
        .leftJoin(
          'misc_db.video',
          'misc_db.video.section_id',
          'misc_db.section.id'
        )
        .leftJoin(
          'misc_db.watch_history as wh',
          'wh.video_id',
          'misc_db.video.id'
        )
        .where('misc_db.section.course_id', '=', courseId)
        .select((eb) => [
          'misc_db.section.id as sid',
          'misc_db.section.title as stitle',
          'misc_db.section.order as sorder',
          'misc_db.video.id as vid',
          'misc_db.video.title as vtitle',
          'misc_db.video.url as vurl',
          'misc_db.video.order as vorder',
          'misc_db.video.previewable as vpreview',
          eb.fn.coalesce('wh.completed', sql<boolean>`false`).as('completed'),
        ])
        .orderBy('sorder', 'asc')
        .orderBy('vorder', 'asc')

      const rows = queryExpr.execute()
      type ResultType = Awaited<typeof rows>
      const { sql: sqlExpr, parameters } = await queryExpr.compile()

      const [result, error] = await rds.query<
        {
          course_id: number
        },
        ResultType
      >(
        {
          sql: sqlExpr,
          params: { course_id: courseId },
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering getting section videos' + error.message + error.stack
        )
      }

      const section_videos = result.data as unknown as ResultType
      const contents: Record<string, IContents> = {}
      if (section_videos) {
        for (let i = 0; i < section_videos.length; i++) {
          if (contents[section_videos[i].sid]) {
            contents[section_videos[i].sid]['videos'].push({
              vid: section_videos[i].vid!,
              title: section_videos[i].vtitle!,
              vorder: section_videos[i].vorder!,
              url: section_videos[i].vpreview ? section_videos[i].vurl! : '',
              completed: section_videos[i].completed,
            })
          } else {
            contents[section_videos[i].sid] = {
              title: section_videos[i].stitle,
              sorder: section_videos[i].sorder,
              sid: section_videos[i].sid,
              videos: section_videos[i].vtitle
                ? [
                    {
                      vid: section_videos[i].vid!,
                      title: section_videos[i].vtitle!,
                      vorder: section_videos[i].vorder!,
                      url: section_videos[i].vpreview
                        ? section_videos[i].vurl!
                        : '',
                      completed: section_videos[i].completed,
                    },
                  ]
                : [],
            }
          }
        }
      }
      return Object.values(contents)
    } catch (error) {
      console.error(error)
    }
  }

  async getSectionVideosEditable(courseId: number) {
    try {
      const queryExpr = db
        .selectFrom('misc_db.section')
        .leftJoin(
          'misc_db.video',
          'misc_db.video.section_id',
          'misc_db.section.id'
        )
        .leftJoin(
          'misc_db.watch_history as wh',
          'wh.video_id',
          'misc_db.video.id'
        )
        .where('misc_db.section.course_id', '=', courseId)
        .select((eb) => [
          'misc_db.section.id as sid',
          'misc_db.section.title as stitle',
          'misc_db.section.order as sorder',
          'misc_db.video.id as vid',
          'misc_db.video.title as vtitle',
          'misc_db.video.url as vurl',
          'misc_db.video.order as vorder',
          'misc_db.video.previewable as vpreview',
          eb.fn.coalesce('wh.completed', sql<boolean>`false`).as('completed'),
        ])
        .orderBy('sorder', 'asc')
        .orderBy('vorder', 'asc')

      // .select(['misc_db.section.id as sid', 'misc_db.section.title as stitle', 'misc_db.section.order as sorder', 'misc_db.video.id as vid', 'misc_db.video.title as vtitle', 'misc_db.video.url as vurl', 'misc_db.video.order as vorder', 'misc_db.video.previewable as vpreview',
      // .orderBy('sorder', 'asc').orderBy('vorder', 'asc');
      // ])

      const rows = queryExpr.execute()
      type ResultType = Awaited<typeof rows>
      const { sql: sqlExpr, parameters } = await queryExpr.compile()

      const [result, error] = await rds.query<
        {
          course_id: number
        },
        ResultType
      >(
        {
          sql: sqlExpr,
          params: { course_id: courseId },
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering getting section videos editable' +
            error.message +
            error.stack
        )
      }

      const section_videos = result.data as unknown as ResultType
      const contents: Record<string, IContents> = {}
      if (section_videos) {
        for (let i = 0; i < section_videos.length; i++) {
          if (contents[section_videos[i].sid]) {
            contents[section_videos[i].sid]['videos'].push({
              vid: section_videos[i].vid!,
              title: section_videos[i].vtitle!,
              vorder: section_videos[i].vorder!,
              url: section_videos[i].vurl!,
              completed: section_videos[i].completed,
            })
          } else {
            contents[section_videos[i].sid] = {
              title: section_videos[i].stitle,
              sorder: section_videos[i].sorder,
              sid: section_videos[i].sid,
              videos: section_videos[i].vtitle
                ? [
                    {
                      vid: section_videos[i].vid!,
                      title: section_videos[i].vtitle!,
                      vorder: section_videos[i].vorder!,
                      url: section_videos[i].vurl!,
                      completed: section_videos[i].completed,
                    },
                  ]
                : [],
            }
          }
        }
      }
      return Object.values(contents)
    } catch (error) {
      console.error(error)
    }
  }

  async editSection(sectionId: number, body: UpdateSection) {
    try {
      const { title, description } = body

      if (!title || !description) {
        throw new Error('Title and Description are required fields')
      }

      const queryExpr = db
        .updateTable('misc_db.section')
        .set({
          title,
          description,
        })
        .where('id', '=', sectionId)
        .returning('id')

      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>
      const { sql, parameters } = await queryExpr.compile()

      const [result, error] = await rds.queryOne<
        {
          title: string
          description: string
          id: number
        },
        ResultType
      >(
        {
          sql: sql,
          params: { title: title!, description: description!, id: sectionId },
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering edit section' + error.message + error.stack
        )
      }
      return result.data
    } catch (error) {
      console.error(error)
    }
  }

  async deleteSection(sectionId: number) {
    try {
      const queryExpr = db
        .deleteFrom('misc_db.section')
        .where('id', '=', sectionId)
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
          params: { id: sectionId },
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering getting deleting section' + error.message + error.stack
        )
      }
      return result.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}

export const sectionService = new SectionService()

/* 
     await sql`UPDATE section
            SET "order" = "order" + 1
            WHERE "order" >= ${order};`.execute(db)
*/
