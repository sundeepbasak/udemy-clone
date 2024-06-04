import CardSearchItem from '@/components/Cards/CardSearchItem'
import Spinner from '@/components/Spinner'
import { Button } from '@/components/ui/button'
import { API_URL } from '@/constants/url'
import { useSearchResults } from '@/hooks/useSearchResults'
import { SearchItem } from '@/types/client.types'
import { useEffect, useState } from 'react'

const SearchResults = ({
  itemToBeSearched,
  type,
}: {
  itemToBeSearched: string
  type: SearchItem
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [results, setResults] = useState<any[]>([])
  const [resultsCount, setResultsCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setResults([])
    setCurrentPage(1)
  }, [itemToBeSearched, type])

  useEffect(() => {
    async function fetchSearchResults() {
      let res
      try {
        if (type === 'term') {
          console.log('term request')
          res = await fetch(
            `${API_URL}/course/search?q=${itemToBeSearched}&page=${currentPage}`
          )
        } else if (type === 'category') {
          console.log('term category')
          res = await fetch(
            `${API_URL}/course/search?category=${itemToBeSearched}&page=${currentPage}`
          )
        } else {
          console.log('term subcategory')
          res = await fetch(
            `${API_URL}/course/search?sub_category=${itemToBeSearched}&page=${currentPage}`
          )
        }
        const { courses: searchResults, count } = await res.json()

        console.log('useSearchResults', searchResults)

        setResults((prevResults) => [...prevResults, ...searchResults])
        setResultsCount(count)
        setIsLoading(false)
        setIsSuccess(true)
      } catch (error) {
        console.error('ERR! SEARCH FAILED', error)
        setIsLoading(false)
        setIsError(true)
      }
    }

    fetchSearchResults()
  }, [currentPage, itemToBeSearched, type])

  function handleLoadMore() {
    setCurrentPage((prevPage) => prevPage + 1)
  }

  console.log('item to be searched', itemToBeSearched)

  return (
    <>
      <div className='flex min-h-screen flex-col items-center justify-between py-2'>
        {isLoading && <Spinner />}
        {!isLoading && results?.length === 0 && (
          <div className='text-2xl'>{`Sorry, we couldn't find any results for ${itemToBeSearched}`}</div>
        )}

        {!isLoading && results && results.length > 0 && (
          <div className='container mx-auto w-[90%]'>
            <h2 className='text-lg lg:text-2xl font-semibold my-2'>{`${resultsCount} results for "${itemToBeSearched}"`}</h2>

            <div className='flex py-3'>
              <div className='w-full'>
                {!isLoading &&
                  results?.map((item) => (
                    <CardSearchItem key={item.id} item={item} />
                  ))}
              </div>
            </div>
          </div>
        )}
        <Button
          onClick={handleLoadMore}
          disabled={results.length === resultsCount}
        >
          Load More
        </Button>
      </div>
    </>
  )
}

export default SearchResults
