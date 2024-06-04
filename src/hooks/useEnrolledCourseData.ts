'use client'
import { API_URL } from '@/constants/url'
import { Course } from '@/types/client.types'
import { useEffect, useState } from 'react'

export function useEnrolledCourseData() {
  const [data, setData] = useState<null | Course[]>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchEnrolledCoursesData = async () => {
      try {
        const res = await fetch(`${API_URL}/user/learning`)
        const { data } = await res.json()

        setData(data)
        setIsLoading(false)
        setIsSuccess(true)
      } catch (error) {
        console.error('Error fetching course data:', error)
        setIsLoading(false)
        setIsError(true)
      }
    }

    fetchEnrolledCoursesData()
  }, [])

  return { data, isLoading, isSuccess }
}
