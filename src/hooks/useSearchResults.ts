import { API_URL } from '@/constants/url'
import { Course, SearchItem } from '@/types/client.types'
import { useEffect, useState } from 'react'

export function useSearchResults(
  item: string,
  type: SearchItem = 'term',
  pageNumber: number = 1
) {
  const [data, setData] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  console.log('item', item)
  console.log('useSearch params called')

  console.log('data: searchResults', data)

  useEffect(() => {
    async function fetchSearchResults() {
      let res
      try {
        if (type === 'term') {
          console.log('term request')
          res = await fetch(
            `${API_URL}/course/search?q=${item}&page=${pageNumber}`
          )
        } else if (type === 'category') {
          console.log('term category')
          res = await fetch(
            `${API_URL}/course/search?category=${item}&page=${pageNumber}`
          )
        } else {
          console.log('term subcategory')
          res = await fetch(
            `${API_URL}/course/search?sub_category=${item}&page=${pageNumber}`
          )
        }
        const { courses: searchResults } = await res.json()

        console.log('useSearchResults', searchResults)

        setData([...data, ...searchResults])
        setIsLoading(false)
        setIsSuccess(true)
      } catch (error) {
        console.error('ERR! SEARCH FAILED', error)
        setIsLoading(false)
        setIsError(true)
      }
    }

    fetchSearchResults()
  }, [item, type, pageNumber])

  return { data, isLoading, isSuccess, isError }
}
