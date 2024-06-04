import { API_URL } from '@/constants/url'
import { Section } from '@/types/client.types'
import { useEffect, useState } from 'react'

export function useSectionsData(
  courseId: number | undefined,
  edit: boolean = false,
  stateToReload: boolean
) {
  const [data, setData] = useState<null | Section[]>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchSections = async () => {
      try {
        if (courseId) {
          let res

          if (edit) {
            res = await fetch(`${API_URL}/course/${courseId}/section?edit=true`)
          } else {
            res = await fetch(`${API_URL}/course/${courseId}/section`)
          }

          const { data } = await res.json()
          setData(data)
          setIsLoading(false)
          setIsSuccess(true)
        }
      } catch (error) {
        console.error('Error fetching sections:', error)
        setIsLoading(false)
        setIsError(true)
      }
    }

    fetchSections()
  }, [courseId, edit, stateToReload])

  return { data, isLoading, isSuccess, isError }
}
