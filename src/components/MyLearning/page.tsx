'use client'

import { API_URL } from '@/constants/url'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { EnrolledCourse } from '@/types/client.types'
import CardProgressH from '../Cards/CardProgressH'

const data = true

const MyLearning = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])

  useEffect(() => {
    async function getEnrolledCourses() {
      const res = await fetch(`${API_URL}/user/learning`)

      if (!res.ok) {
        throw new Error('Failed to fetch user learning')
      }

      const { data } = await res.json()

      console.log('ENROLLED COURSES', data)

      setEnrolledCourses(data)
    }

    getEnrolledCourses()
  }, [])

  return (
    enrolledCourses.length > 0 && (
      <section className='py-5'>
        <div className='flex justify-between items-center'>
          {data && (
            <h2 className='font-sans text-4xl mb-8 mt-2 font-medium'>
              {"Let's start learning"}
            </h2>
          )}
          {data && (
            <Button
              variant='link'
              className='underline text-indigo-700 font-medium text-base'
            >
              <Link href={`/my-courses/learning`}>My learning</Link>
            </Button>
          )}
        </div>
        <div className='grid gap-4 place-items-center md:place-items-baseline grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-16'>
          {enrolledCourses &&
            enrolledCourses.map((course: EnrolledCourse) => {
              return (
                <CardProgressH
                  key={course.id}
                  {...course}
                  card_type='horizontal'
                />
              )
            })}
        </div>
      </section>
    )
  )
}

export default MyLearning
