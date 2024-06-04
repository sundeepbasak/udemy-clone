'use client'
import Card from '@/components/Cards/Card'
// import { BsFilterLeft } from "react-icons/bs";
// import { Button, Spinner } from "flowbite-react";
import Navbar from '@/components/Navbar'
import MainFooter from '@/components/Footer'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSearchResults } from '@/hooks/useSearchResults'

import { Button } from '@/components/ui/button'
import Spinner from '@/components/Spinner'
import CardSearchItem from '@/components/Cards/CardSearchItem'
import { useEffect, useState } from 'react'
import { Router } from 'lucide-react'
import { SearchItem } from '@/types/client.types'
import SearchResults from './components/SearchResults'

export default function SearchPage() {
  const [pageNumber, setPageNumber] = useState<number>(1)
  const router = useRouter()
  const searchParams = useSearchParams()
  let searchItem = searchParams.get('q')
  let category = searchParams.get('category')
  let sub_category = searchParams.get('sub_category')

  if (category === null) {
    category = ''
  }
  if (searchItem === null) {
    searchItem = ''
  }
  if (sub_category === null) {
    sub_category = ''
  }

  const itemToBeSearched = searchItem
    ? searchItem
    : category
    ? category
    : sub_category

  const type: SearchItem = searchItem
    ? 'term'
    : category
    ? 'category'
    : 'subcategory'

  return (
    <>
      <SearchResults itemToBeSearched={itemToBeSearched} type={type} />
    </>
  )
}

// className='flex-1 grid place-items-center md:place-items-baseline grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'

{
  /* <div className='flex gap-5 my-2'>
              <Button className='rounded-none' variant='outline'>
                <BsFilterLeft className="mr-2 h-5 w-5" />
                <p>Filter</p>
              </Button>
              <Button className='rounded-none' variant='outline'>
                Sort by: Relevance
              </Button>
            </div> */
}

{
  /* <aside className='hidden lg:block w-2/6 pr-36'>
                <div className='mb-3'>
                  <h3 className='text-lg font-semibold mb-3'>Price</h3>
                  <div>
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center'>
                        <input
                          id='default-checkbox'
                          type='checkbox'
                          value=''
                          className='w-6 h-6 text-blue-600 border-gray-600 border-2 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        />
                        <label
                          htmlFor='default-checkbox'
                          className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                        >
                          Free
                        </label>
                      </div>
                      <div className='border px-4 border-gray-300 rounded-full text-sm'>
                        11
                      </div>
                    </div>
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center'>
                        <input
                          id='default-checkbox'
                          type='checkbox'
                          value=''
                          className='w-6 h-6 text-blue-600 border-gray-600 border-2 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        />
                        <label
                          htmlFor='default-checkbox'
                          className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                        >
                          Paid
                        </label>
                      </div>
                      <div className='border px-4 border-gray-300 rounded-full text-sm'>
                        0
                      </div>
                    </div>
                  </div>
                </div>
              </aside> */
}
