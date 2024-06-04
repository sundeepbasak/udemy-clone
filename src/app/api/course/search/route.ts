import { courseService } from '@/services/course.service'
import { NextRequest, NextResponse } from 'next/server'

export interface ICourseSearch {
  q?: string
  category?: string
  sub_category?: string
  page?: string
}
export const dynamic = 'force-dynamic'
//api endpoint: /api/course/search
export async function GET(req: NextRequest) {
  try {
    const queryParams = new URL(req.nextUrl).searchParams
    const {
      q = '',
      category = '',
      sub_category = '',
      page = '1',
    }: ICourseSearch = Object.fromEntries(queryParams)
    const searchParams = { q, category, sub_category }
    // const searchParams = { q: '', category: '', sub_category: '' };
    // const page = 1;

    const { courses, count } = await courseService.searchCourse(
      searchParams,
      Number(page)
    )
    if (!courses || !count) {
      return NextResponse.json({ courses: [], count: 0 })
    }
    return NextResponse.json({ courses: courses, count: count })
  } catch (error) {
    console.error(error)
  }
}
