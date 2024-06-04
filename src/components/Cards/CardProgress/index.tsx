'use client'

import Image from 'next/image'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EnrolledCourse } from '@/types/client.types'

export default function CardProgress({
  id,
  title,
  course_slug,
  instructor,
  mrp_price,
  discount,
  is_free,
  thumbnail,
  last_watched_video,
  last_watched_video_progress,
  completed_videos,
  total_videos,
}: EnrolledCourse) {
  const progress = Math.floor((completed_videos / total_videos) * 100)
  console.log({ progress })

  return (
    <div className='flex w-[400px] rounded-md h-36 border'>
      <div className='bg-gray-400 w-40 h-full relative rounded-l-sm'>
        <Image
          src={thumbnail}
          alt={title}
          fill
          priority
          className='object-cover rounded-l-sm'
        />
      </div>
      <div className='flex flex-col justify-between w-full'>
        <div className='px-4'>
          <h5 className='font-semibold text-lg'>{title}</h5>
          <h6>{instructor}</h6>
        </div>
        <div className='mt-auto'>
          <div className='mx-4 mb-2'>
            <Link href={`/course/${id}/learn/lecture/${last_watched_video}`}>
              <Button
                variant='outline'
                size='sm'
                className='pl-0 w-full font-semibold'
              >
                {progress > 0 ? 'Continue Learning' : 'Start Learning'}
              </Button>
            </Link>
          </div>
          <Progress value={progress} className='rounded-none h-2' />
        </div>
      </div>
    </div>
  )
}
