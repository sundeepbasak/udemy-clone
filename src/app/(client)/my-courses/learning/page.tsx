'use client'

import Card from '@/components/Cards/CardProgressH'
import Spinner from '@/components/Spinner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { API_URL } from '@/constants/url'
import { useEnrolledCourseData } from '@/hooks/useEnrolledCourseData'
import { data } from 'autoprefixer'
// import { useEnrolledCourseData } from '@/hooks/useEnrolledCourseData'

// {
//   next: { revalidate: 0 },
// }
// const fetchEnrolledCoursesData = async () => {
//   const res = await fetch(`${API_URL}/user/learning`)
//   const data = await res.json()
//   console.log('enrolled courses', data)
// }

export default function LearningPage() {
  const { data: enrolledCourse, isLoading } = useEnrolledCourseData()
  // const { data: enrolledCourse } = await fetchEnrolledCoursesData()

  // console.log('MY LEARNING', enrolledCourse)
  // await fetchEnrolledCoursesData()

  // const enrolledCourse: any[] = []

  return (
    <div className='py-8 max-w-[70%] mx-auto'>
      <div className='flex justify-between items-center py-2 mb-2'>
        <div className='flex gap-3'>
          <Button variant='outline' className='rounded-none'>
            Sort by: Relevance
          </Button>
          <Button variant='outline' className='rounded-none'>
            Progress
          </Button>
        </div>
        <div>
          <div className='relative hidden lg:block'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <svg
                className='w-4 h-4 text-gray-500 dark:text-gray-400'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 20'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                />
              </svg>
            </div>
            <input
              type='search'
              id='default-search'
              className='block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Search course'
            />
          </div>
        </div>
      </div>
      {isLoading && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
          <div className='rounded-sm flex flex-col border-gray-300 border'>
            <div className='bg-gray-400 w-full h-44 rounded-t-sm relative'>
              <Skeleton className='w-full h-full rounded-t-sm rounded-b-none' />
            </div>
            <div className='p-3 flex flex-col justify-between mx-auto min-h-[150px] flex-1 mt-auto w-full'>
              <Skeleton className='w-1/2 h-[20px]'></Skeleton>
              <div className='mt-auto'>
                <Skeleton className='w-2/3 h-[20px] mt-2'></Skeleton>
                <Skeleton className='w-2/3 h-[20px] mt-2'></Skeleton>
              </div>
            </div>
            <div className='mt-auto'>
              <Skeleton className='w-2/3 h-[5px] mt-2 rounded-none'></Skeleton>
            </div>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
        {enrolledCourse && enrolledCourse.length === 0 && (
          <p>No courses enrolled</p>
        )}
        {enrolledCourse &&
          enrolledCourse.map((course: any, index: number) => {
            return <Card key={course.id} {...course} />
          })}
      </div>
    </div>
  )
}
