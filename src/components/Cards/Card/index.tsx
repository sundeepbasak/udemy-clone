'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { API_URL } from '@/constants/url'
import { useThumbnail } from '@/hooks/useThumbnail'
import { Course } from '@/types/client.types'

async function getResolvedThumbnail(thumbnail: string) {
  const res = await fetch(`${API_URL}/files/download?key=${thumbnail}`)

  return res.json()
}

export default function Card({
  title,
  course_slug,
  instructor,
  mrp_price,
  discount,
  is_free,
  thumbnail,
  category,
  sub_category,
}: Course): JSX.Element {
  // const [resolvedThumbnail, setResolvedThumbnail] = useState('')

  // useEffect(() => {
  //   async function fetchThumbnails() {
  //     const data = await getResolvedThumbnail(thumbnail)

  //     setResolvedThumbnail(data.url)
  //   }

  //   fetchThumbnails()
  // }, [thumbnail])

  // const resolvedThumbnail = useThumbnail(thumbnail)
  // const placeholderImage = 'http://via.placeholder.com/640x360'

  return (
    <div className='h-[350px] rounded-lg border border-violet-100 flex-col flex shadow-lg mx-2'>
      <div className='w-full h-44 relative overflow-hidden rounded-t-sm'>
        <Image
          // src={resolvedThumbnail ? resolvedThumbnail : placeholderImage}
          src={thumbnail}
          alt={title}
          fill
          priority
          className='object-cover duration-300 ease-in-out rounded-t-sm'
        />
      </div>
      <div className='flex flex-col justify-between mx-auto h-auto px-3 pb-3 flex-1 w-full'>
        <div className=''>
          <div className='flex justify-between pt-3'>
            <span>143 Learners</span>
            <span>9h 2m</span>
          </div>
          <div className='flex gap-2'>
            <Badge className='bg-violet-500'>{category}</Badge>
            <Badge className='bg-violet-500'>{sub_category}</Badge>
          </div>
          <Link href={`/course/${course_slug}`}>
            <h5 className='font-semibold text-lg py-1'>{title}</h5>
          </Link>
        </div>
        <div className='flex justify-between items-center'>
          <h6 className='font-semibold mt-2'>{instructor}</h6>
          <span className='before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-violet-800 relative inline-block'>
            <span className='relative text-white'>
              {is_free ? 'Free' : mrp_price}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
