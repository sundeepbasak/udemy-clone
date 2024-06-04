import { ICourseSearch } from '@/app/api/course/search/route'
import {
  ACCESS_KEY_ID_2,
  BUCKET_NAME_2,
  REGION_2,
  SECRET_ACCESS_KEY_2,
  URL_EXPIRY_MINS,
} from '@/constants/config.constants'
import { AwsS3BucketService } from '@/lib/s3.aws.lib'
import { NewCourse, UpdateCourse } from '@/types/database.types'
import { RdsClientV2 } from '@/utils/RdsClient'
import { db } from '@/utils/database-driver.utils'
import { prepareStatement } from '@/utils/prepareSQL.utils'
import { Expression, SqlBool, sql } from 'kysely'
import * as uuid from 'uuid'
import { fileService } from './file.service'
import { generatePaginationData } from '@/utils/paginate.utils'

const s3BucketService = new AwsS3BucketService(
  ACCESS_KEY_ID_2,
  SECRET_ACCESS_KEY_2,
  REGION_2,
  BUCKET_NAME_2,
  URL_EXPIRY_MINS
)

const rds = new RdsClientV2()

export type ConvertToConcrete<T extends Record<string, any> | undefined> =
  T extends undefined ? never : T

interface ISearchParams {
  q?: string
  category?: string
  sub_category?: string
  limit: number
  offset: number
}

class CourseService {
  async getAllCourses(isPublished: boolean, page: number) {
    try {
      const queryExpr = db
        .selectFrom('misc_db.course')
        .innerJoin(
          'misc_db.category',
          'misc_db.category.id',
          'misc_db.course.category_id'
        )
        .innerJoin(
          'misc_db.sub_category',
          'misc_db.sub_category.id',
          'misc_db.course.sub_category_id'
        )
        .select([
          'misc_db.course.id',
          'misc_db.course.title',
          'misc_db.course.description',
          'misc_db.course.course_slug',
          'misc_db.course.thumbnail',
          'misc_db.course.instructor',
          'misc_db.category.name as category',
          'misc_db.sub_category.name as sub_category',
          'misc_db.course.mrp_price',
          'misc_db.course.discount',
          'misc_db.course.is_free',
          'misc_db.course.is_published',
          'misc_db.course.requirements',
          'misc_db.course.tags',
          'misc_db.course.contents',
        ])
        .where('misc_db.course.is_published', '=', isPublished)
        .orderBy('misc_db.course.updated_at', 'desc')
        .limit(9)
        .offset((page - 1) * 9)

      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>
      const paramsObj = { isPublished, limit: 9, offset: (page - 1) * 9 }
      const { sql, parameters } = await queryExpr.compile()
      const [result, error] = await rds.query<typeof paramsObj, ResultType>(
        {
          sql,
          params: paramsObj,
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering get all courses' + error.message + error.stack
        )
      }

      let courses: ConvertToConcrete<ResultType>[] = []
      const nonEmptyCourses = result.data?.filter(
        (v): v is ConvertToConcrete<ResultType> => v !== undefined
      )
      const { batches } = generatePaginationData(nonEmptyCourses, 10)

      for (const batch of batches) {
        const { slice } = batch
        const coursesBatch = (
          await Promise.allSettled(
            slice.map(async (v) => {
              const { url } = await fileService.getPresignedUrlForDownload(
                v.thumbnail
              )
              return {
                ...v,
                thumbnail: url,
              }
            })
          )
        )
          .map((v) => {
            switch (v.status) {
              case 'fulfilled':
                return v.value
              case 'rejected':
                return null
            }
          })
          .filter((v): v is ConvertToConcrete<ResultType> => v !== null)
        courses = courses.concat(coursesBatch)
      }
      return courses
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async getCourseById(cId: number) {
    try {
      const queryExpr = db
        .selectFrom('misc_db.course')
        .selectAll()
        .where('id', '=', cId)
      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>

      const { sql, parameters } = await queryExpr.compile()

      const query = prepareStatement(sql, ['id'])
      const [result, error] = await rds.queryOne<{ id: number }, ResultType>({
        sql: query,
        params: { id: cId },
      })

      if (error !== null) {
        throw new Error(
          'Error quering get course by id' + error.message + error.stack
        )
      }

      let course = {} as any
      const { url } = await fileService.getPresignedUrlForDownload(
        result.data?.thumbnail!
      )
      course = { ...result.data, thumbnail: url }
      return course
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async getCourseBySlug(slug: string) {
    try {
      const queryExpr = db
        .selectFrom('misc_db.course')
        .selectAll()
        .where('course_slug', '=', slug)
      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>

      const { sql, parameters } = await queryExpr.compile()
      const query = prepareStatement(sql, ['course_slug'])

      const [result, error] = await rds.queryOne<
        { course_slug: string },
        ResultType
      >({
        sql: query,
        params: { course_slug: slug },
      })

      if (error !== null) {
        throw new Error(
          'Error querying get course by slug' + error.message + error.stack
        )
      }
      let course = {} as any
      const { url } = await fileService.getPresignedUrlForDownload(
        result.data?.thumbnail!
      )
      course = { ...result.data, thumbnail: url }
      return course
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async createCourse(body: NewCourse) {
    const {
      title,
      description,
      category_id,
      sub_category_id,
      thumbnail,
      mrp_price,
      discount,
      is_free,
      instructor,
      requirements,
      tags,
      contents,
    } = body

    const courseSlug = title.split(' ').join('-').toLowerCase()
    try {
      const queryExpr = db
        .insertInto('misc_db.course')
        .values({
          title,
          description,
          course_slug: courseSlug,
          thumbnail,
          instructor,
          category_id,
          sub_category_id,
          mrp_price,
          discount,
          is_free,
          is_published: false,
          requirements,
          tags,
          contents,

        })
        .returning(['id', 'title'])

      const paramsObj = {
        title,
        description,
        courseSlug,
        thumbnail,
        instructor,
        category_id,
        sub_category_id,
        mrp_price,
        discount,
        is_free,
        isPublished: false,
        requirements,
        tags,
        contents,
      }
      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>

      const { sql, parameters } = await queryExpr.compile()
      const [result, error] = await rds.queryOne<typeof paramsObj, ResultType>(
        {
          sql,
          params: {
            title,
            description,
            courseSlug,
            thumbnail,
            instructor,
            category_id,
            sub_category_id,
            mrp_price,
            discount,
            is_free,
            isPublished: false,
            requirements: requirements ?? null,
            tags: tags ?? null,
            contents: contents ?? null,
          },
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error querying creating course ' + error.message + error.stack
        )
      }

      return result.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async updateCourse(courseId: number, body: UpdateCourse) {
    const {
      title,
      description,
      category_id,
      sub_category_id,
      thumbnail,
      mrp_price,
      is_free,
      instructor,
      requirements,
      tags,
      contents,
      discount,
    } = body
    const courseSlug = title?.split(' ').join('-').toLowerCase()

    try {
      const queryExpr = db
        .updateTable('misc_db.course')
        .set({
          title,
          description,
          course_slug: courseSlug,
          thumbnail,
          instructor,
          category_id,
          sub_category_id,
          mrp_price,
          discount,
          is_free,
          requirements,
          tags,
          contents,
          updated_at: sql`now()`
        })
        .where('id', '=', courseId)
        .returning(['id', 'title'])

      const paramsObj = {
        title: title ?? null,
        description: description ?? null,
        courseSlug: courseSlug ?? null,
        thumbnail: thumbnail ?? null,
        instructor: instructor ?? null,
        category_id: category_id ?? null,
        sub_category_id: sub_category_id ?? null,
        mrp_price: mrp_price ?? null,
        discount: discount ?? null,
        is_free: is_free ?? null,
        isPublished: false,
        requirements: requirements ?? null,
        tags: tags ?? null,
        contents: contents ?? null,
        updated_at: sql`now()`
      }
      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>
      const { sql: sqlQuery, parameters } = await queryExpr.compile()

      const [result, error] = await rds.queryOne<typeof paramsObj, ResultType>({
        sql: sqlQuery,
        params: paramsObj,
      })

      if (error !== null) {
        throw new Error(
          'Error querying updating course ' + error.message + error.stack
        )
      }
      return result.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async publishCourse(courseId: number) {
    try {
      const queryExpr = db
        .updateTable('misc_db.course')
        .set({
          is_published: true,
          updated_at: sql`now()`
        })
        .where('id', '=', courseId)

      const paramsObj = { isPublished: true, courseId, updated_at: sql`now()` }
      const { sql: sqlQuery, parameters } = await queryExpr.compile()
      const [result, error] = await rds.queryOne<typeof paramsObj, {}>(
        {
          sql: sqlQuery,
          params: paramsObj,
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error querying publish course ' + error.message + error.stack
        )
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async deleteCourse(courseId: number) {
    try {
      await db
        .deleteFrom('misc_db.course')
        .where('id', '=', courseId)
        .executeTakeFirstOrThrow()
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  //find if the user is already enrolled in the course
  async isUserAlreadyEnrolled(
    courseId: number,
    userId: number
  ): Promise<boolean> {
    try {
      const queryExpr = db
        .selectFrom('misc_db.course_enrollments')
        .select('id')
        .where('misc_db.course_enrollments.course_id', '=', courseId)
        .where('misc_db.course_enrollments.user_id', '=', userId)

      const paramsObj = { courseId, userId }
      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>
      const { sql, parameters } = await queryExpr.compile()

      const [result, error] = await rds.queryOne<typeof paramsObj, ResultType>(
        {
          sql,
          params: { courseId, userId },
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering is user already enrolled' + error.message + error.stack
        )
      }

      if (result.data?.id) {
        return true
      }
      return false
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  //enroll to a course
  async enrollToCourse(courseId: number, userId: number) {
    try {
      const queryExpr = db.insertInto('misc_db.course_enrollments').values({
        user_id: userId,
        course_id: courseId,
        payment_id: null,
      })

      const paramsObj = { userId, courseId, paymentId: null }
      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>

      const { sql, parameters } = await queryExpr.compile()
      const [result, error] = await rds.queryOne<typeof paramsObj, ResultType>(
        {
          sql,
          params: { userId, courseId, paymentId: null },
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering enroll to course' + error.message + error.stack
        )
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async uploadImage(file: File) {
    const imagesFolder = 'thumbnails'

    const fileSize = file.size
    const fileContent = file.type
    const fileKey = `${imagesFolder}/${uuid.v4()}-${file.name
      .replace(/\s+/g, '-')
      .toLowerCase()}`
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    try {
      const fileUrl = await s3BucketService.uploadFileToS3(
        fileKey,
        buffer,
        fileContent
      )
      return fileUrl
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async deleteImage(fileKey: string) {
    try {
      const result = await s3BucketService.deleteFileFromS3(fileKey)
      console.log({ result })
    } catch (error) {
      console.error(error)
    }
  }

  async searchCourse(searchParams: ICourseSearch, page: number) {
    try {
      const { q = '', category = '', sub_category = '' } = searchParams
      const paramsObj: any = { limit: 5, offset: (page - 1) * 5 }
      let conditionsSQL = ``
      if (q) {
        paramsObj['q'] = q
        conditionsSQL += `AND (course.title ILIKE '%' || :q || '%')`
      }

      if (category) {
        paramsObj['category'] = category
        conditionsSQL += `AND (cat.name ILIKE '%' || :category || '%')`
      }

      if (sub_category) {
        paramsObj['sub_category'] = sub_category
        conditionsSQL += `AND (sub_cat.name ILIKE '%' || :sub_category || '%')`
      }
      const searchQuery = `SELECT
            course.id,
            course.title,
            course.description,
            course.course_slug,
            course.thumbnail,
            course.instructor,
            cat.name AS category,
            sub_cat.name AS sub_category,
            course.mrp_price,
            course.discount,
            course.is_free,
            course.tags,
            course.contents
        FROM
            misc_db.course
        INNER JOIN
            misc_db.category AS cat ON cat.id = misc_db.course.category_id
        INNER JOIN
            misc_db.sub_category AS sub_cat ON sub_cat.id = misc_db.course.sub_category_id
        WHERE
            misc_db.course.is_published = true
            ${conditionsSQL}
        LIMIT :limit
        OFFSET :offset;`

      const paramsObj2: Record<string, string> = { ...paramsObj }
      delete paramsObj2.limit
      delete paramsObj2.offset

      const searchCountQuery = `SELECT
                                    count(*)
                                FROM
                                    misc_db.course
                                INNER JOIN
                                    misc_db.category AS cat ON cat.id = misc_db.course.category_id
                                INNER JOIN
                                    misc_db.sub_category AS sub_cat ON sub_cat.id = misc_db.course.sub_category_id
                                WHERE
                                    misc_db.course.is_published = true
                                    ${conditionsSQL}`

      const countPromise = rds.queryOne<typeof paramsObj2, { count: number }>({
        sql: searchCountQuery,
        params: paramsObj2,
      })

      const searchPromise = rds.query<typeof paramsObj, {}>({
        sql: searchQuery,
        params: paramsObj,
      })

      const [res1, res2] = await Promise.all([countPromise, searchPromise])

      const [data1, err1] = res1
      const [data2, err2] = res2

      if (err1 !== null) {
        throw new Error(
          'Error quering search course' + err1.message + err1.stack
        )
      }

      if (err2 !== null) {
        throw new Error(
          'Error quering search course' + err2.message + err2.stack
        )
      }

      //define result type --> replace any with ResultType

      let courses: ConvertToConcrete<any>[] = []
      const nonEmptyCourses = data2.data?.filter(
        (v): v is ConvertToConcrete<any> => v !== undefined
      )
      const { batches } = generatePaginationData(nonEmptyCourses, 10)

      for (const batch of batches) {
        const { slice } = batch
        const coursesBatch = (
          await Promise.allSettled(
            slice.map(async (v) => {
              const { url } = await fileService.getPresignedUrlForDownload(
                v.thumbnail
              )
              return {
                ...v,
                thumbnail: url,
              }
            })
          )
        )
          .map((v) => {
            switch (v.status) {
              case 'fulfilled':
                return v.value
              case 'rejected':
                return null
            }
          })
          .filter((v): v is ConvertToConcrete<any> => v !== null)
        courses = courses.concat(coursesBatch)
      }
      return { courses, count: data1.data?.count }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  //get top courses: but do not show the courses already enrolled by the user
  async getPopularCourses() {
    console.log('get popular courses')
    try {
      const queryExpr = db
        .selectFrom('misc_db.course')
        .innerJoin(
          'misc_db.category as cat',
          'cat.id',
          'misc_db.course.category_id'
        )
        .innerJoin(
          'misc_db.sub_category as sub_cat',
          'sub_cat.id',
          'misc_db.course.sub_category_id'
        )
        .innerJoin(
          'misc_db.course_enrollments as ce',
          'ce.course_id',
          'misc_db.course.id'
        )
        .select((eb) => eb.fn.count('ce.user_id').as('enrolled_users'))
        .select([
          'misc_db.course.id',
          'misc_db.course.title',
          'misc_db.course.description',
          'misc_db.course.course_slug',
          'misc_db.course.thumbnail',
          'misc_db.course.instructor',
          'cat.name as category',
          'sub_cat.name as sub_category',
          'misc_db.course.mrp_price',
          'misc_db.course.discount',
          'misc_db.course.is_free',
          'misc_db.course.is_published',
          'misc_db.course.tags',
        ])
        .where('misc_db.course.is_published', '=', true)
        .groupBy(['misc_db.course.id', 'cat.name', 'sub_cat.name'])
        .orderBy('enrolled_users', 'desc')
        .limit(5)

      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>

      const { sql, parameters } = await queryExpr.compile()
      const [result, error] = await rds.query<
        { isPublished: boolean; limit: number },
        ResultType
      >(
        {
          sql,
          params: { isPublished: true, limit: 5 },
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering get popular courses' + error.message + error.stack
        )
      }

      //get presigned url for each course
      let courses: ResultType[] = []
      const nonEmptyCourses = result.data.filter(
        (v): v is ConvertToConcrete<ResultType> => v !== undefined
      )
      const { batches } = generatePaginationData(nonEmptyCourses, 10)

      for (const batch of batches) {
        const { slice } = batch
        const coursesBatch = (
          await Promise.allSettled(
            slice.map(async (v) => {
              const { url } = await fileService.getPresignedUrlForDownload(
                v.thumbnail
              )
              return {
                ...v,
                thumbnail: url,
              }
            })
          )
        )
          .map((v) => {
            switch (v.status) {
              case 'fulfilled':
                return v.value
              case 'rejected':
                return null
            }
          })
          .filter((v): v is ConvertToConcrete<ResultType> => v !== null)
        courses = courses.concat(coursesBatch)
      }
      return courses
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  //get user suggestions by the user interests
  async getCourseSuggestions(userId: number) {
    try {
    } catch (error) { }
  }

  //get new releases //:sort by updated at
  async getNewReleases() {
    try {
      const queryExpr = db
        .selectFrom('misc_db.course')
        .innerJoin(
          'misc_db.category',
          'misc_db.category.id',
          'misc_db.course.category_id'
        )
        .innerJoin(
          'misc_db.sub_category',
          'misc_db.sub_category.id',
          'misc_db.course.sub_category_id'
        )
        .select([
          'misc_db.course.id',
          'misc_db.course.title',
          'misc_db.course.description',
          'misc_db.course.course_slug',
          'misc_db.course.thumbnail',
          'misc_db.course.instructor',
          'misc_db.category.name as category',
          'misc_db.sub_category.name as sub_category',
          'misc_db.course.mrp_price',
          'misc_db.course.discount',
          'misc_db.course.is_free',
          'misc_db.course.is_published',
          'misc_db.course.requirements',
          'misc_db.course.tags',
          'misc_db.course.contents',
        ])
        .where('misc_db.course.is_published', '=', true)
        .orderBy('id', 'desc')
        .limit(10)

      const rows = queryExpr.executeTakeFirst()
      type ResultType = Awaited<typeof rows>
      const paramsObj = { isPublished: true, limit: 10 }
      const { sql, parameters } = await queryExpr.compile()
      const [result, error] = await rds.query<typeof paramsObj, ResultType>(
        {
          sql,
          params: paramsObj,
        },
        parameters
      )

      if (error !== null) {
        throw new Error(
          'Error quering get new releases' + error.message + error.stack
        )
      }

      //get presigned url for each course
      let courses: ResultType[] = []
      const nonEmptyCourses = result.data.filter(
        (v): v is ConvertToConcrete<ResultType> => v !== undefined
      )
      const { batches } = generatePaginationData(nonEmptyCourses, 10)

      for (const batch of batches) {
        const { slice } = batch
        const coursesBatch = (
          await Promise.allSettled(
            slice.map(async (v) => {
              const { url } = await fileService.getPresignedUrlForDownload(
                v.thumbnail
              )
              return {
                ...v,
                thumbnail: url,
              }
            })
          )
        )
          .map((v) => {
            switch (v.status) {
              case 'fulfilled':
                return v.value
              case 'rejected':
                return null
            }
          })
          .filter((v): v is ConvertToConcrete<ResultType> => v !== null)
        courses = courses.concat(coursesBatch)
      }
      return courses
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}

export const courseService = new CourseService()

/* ** Search Course **
async searchCourse(searchParams: ICourseSearch) {
        try {
            console.log("service", searchParams);
            const { q = '', category = '', sub_category = '' } = searchParams;

            let coursesQuery: any = db.selectFrom('course')
                .innerJoin('category', 'category.id', 'course.category_id')
                .innerJoin('sub_category', 'sub_category.id', 'course.sub_category_id')
                .select(['course.id', 'course.title', 'course.description', 'course.course_slug', 'course.thumbnail', 'course.instructor', 'category.name as category', 'sub_category.name as sub_category', 'course.mrp_price', 'course.discount', 'course.discount', 'course.is_free', 'course.tags', 'course.contents'])
                .where('course.is_published', '=', true)


            if (q !== '' || category !== '' || sub_category !== "") {
                coursesQuery = coursesQuery.where((eb: any) => {
                    const ors: Expression<SqlBool>[] = []
                    if (q !== "") {
                        ors.push(eb('course.title', 'ilike', `%${q}%`))
                    }
                    if (category !== "") {
                        ors.push(eb('category.name', 'ilike', `%${category}%`))
                    }
                    if (sub_category !== "") {
                        ors.push(eb('sub_category.name', 'ilike', `%${sub_category}%`))
                    }

                    return eb.or(ors)
                });
            }

            const courses = await coursesQuery.execute()
            return courses;

        } catch (error) {
            console.error(error)
        }
    } 

*/
