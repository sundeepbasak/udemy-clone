'use client'

import Image from 'next/image'
import { useThumbnail } from '@/hooks/useThumbnail'

const CourseImage = ({
  thumbnail,
  title,
}: {
  thumbnail: string
  title: string
}) => {
  const resolvedThumbnail = useThumbnail(thumbnail)
  const placeholderImage = 'http://via.placeholder.com/640x360'

  return (
    <Image
      src={resolvedThumbnail ? resolvedThumbnail : placeholderImage}
      alt={title}
      fill
      priority
      className='object-cover shadow-2xl rounded-xl'
    />
  )
}

export default CourseImage
