'use client'
import { API_URL } from '@/constants/url'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useThumbnail } from '@/hooks/useThumbnail'
import { EnrolledCourse, Section } from '@/types/client.types'

export default function CardProgressH({
  id,
  title,
  course_slug,
  instructor,
  mrp_price,
  discount,
  is_free,
  thumbnail,
  last_watched_video: last_watched_video_id,
  last_watched_video_progress,
  completed_videos,
  total_videos,
  card_type,
  current_section,
}: EnrolledCourse & { card_type: string }) {
  const [sections, setSections] = useState<null | Section[]>(null)
  const [isLoadingSections, setIsLoadingSections] = useState(true)
  const [sectionId, setSectionId] = useState<any>('')
  const router = useRouter()
  // const resolvedThumbnail = useThumbnail(thumbnail)
  // const placeholderImage = 'http://via.placeholder.com/640x360'
  const [last_watched_videokey, setLast_watched_videokey] = useState<
    string | null
  >(null)

  useEffect(() => {
    async function getVideoDetails() {
      if (last_watched_video_id) {
        const res = await fetch(`${API_URL}/video/${last_watched_video_id}`)

        const { data } = await res.json()

        console.log('sid', data.section_id)
        setSectionId(data.section_id)

        const key = data.url.split('/')[1]

        setLast_watched_videokey(key)
      }
    }

    getVideoDetails()
  }, [last_watched_video_id])

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sectionResponse = await fetch(`${API_URL}/course/${id}/section`)
        const { data: sectionsData } = await sectionResponse.json()

        setSections(sectionsData)
        setIsLoadingSections(false)
      } catch (error) {
        console.error('Error fetching sections:', error)
        setIsLoadingSections(false)
      }
    }

    fetchSections()
  }, [id])

  console.log('sections', sections)
  console.log('sectionId', sectionId)

  const firstVideoKey = sections?.[0]?.videos?.[0]?.url.split('/')[1]
  const firstSectionId = sections?.[0]?.sid
  const firstVideoId = sections?.[0]?.videos?.[0]?.vid

  console.log({ firstSectionId })
  // console.log(firstVideo);

  // const sectionId = sections ? sections[0].sid : null;
  // const lectureId = sections ? sections[0].videos[0].vid : null;
  // const lectureTitle = sections ? sections[0].videos[0].title : null;
  // const lectureDetails = `${lectureTitle}_v${lectureId}_s${sectionId}`;

  // console.log(sections && sections[0].videos[0].url);

  // if (!lectureTitle) {
  //   router.push(`/course/${id}`);
  // }

  const progress = Math.floor((completed_videos / total_videos) * 100)
  console.log({ progress })

  console.log('last_video_watched', last_watched_video_id)

  return card_type == 'horizontal' ? (
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
            {last_watched_video_id ? (
              // {
              //   pathname: `/course/${id}/learn/lecture/${last_watched_videokey}`,
              //   query:{
              //     section_id: 68
              //   }
              // }
              <Link
                href={`/course/${id}/learn/lecture/${last_watched_videokey}?video=${last_watched_video_id}&section=${current_section}&progress=${last_watched_video_progress}`}
              >
                <Button
                  variant='outline'
                  className=' pl-0 w-full font-semibold'
                  size='sm'
                >
                  {'Continue Learning'}
                </Button>
              </Link>
            ) : (
              <Link
                href={`/course/${id}/learn/lecture/${firstVideoKey}?video=${firstVideoId}&section=${firstSectionId}`}
              >
                <Button
                  variant='outline'
                  className=' pl-0 w-full font-semibold'
                  size='sm'
                >
                  {'Start Learning'}
                </Button>
              </Link>
            )}
          </div>
          <Progress value={progress} className='rounded-none h-2' />
        </div>
      </div>
    </div>
  ) : (
    <div className='rounded-sm shadow-md flex flex-col border-gray-300 border'>
      <div className='bg-gray-400 w-full h-44 rounded-t-sm relative'>
        <Image
          // src={resolvedThumbnail ? resolvedThumbnail : placeholderImage}
          src={thumbnail}
          alt={title}
          fill
          priority={true}
          className='object-cover rounded-t-sm'
        />
      </div>
      <div className='p-3 flex flex-col justify-between mx-auto min-h-[150px] flex-1 mt-auto w-full'>
        <h5 className='font-semibold text-lg py-1'>{title}</h5>
        <div className='mt-auto'>
          <h6
            className={`font-medium mt-2 text-gray-600 text-sm ${
              (progress === 0 || isNaN(progress)) && 'mb-5'
            }`}
          >
            {instructor}
          </h6>
          <p className='text-xs font-medium text-right mr-2 mb-1 text-gray-600'>
            {progress > 0 && (
              <>
                {progress}% <span className='font-light'>completed</span>
              </>
            )}
          </p>
          {last_watched_video_id ? (
            <Link
              href={`/course/${id}/learn/lecture/${last_watched_videokey}?video=${last_watched_video_id}&section=${sectionId}&progress=${last_watched_video_progress}`}
            >
              <Button variant='default' className=' pl-0 w-full'>
                {'Continue Learning'}
              </Button>
            </Link>
          ) : (
            <Link
              href={`/course/${id}/learn/lecture/${firstVideoKey}?video=${firstVideoId}&section=${firstSectionId}`}
            >
              <Button variant='default' className='pl-0 w-full'>
                {'Start Learning'}
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className='mt-auto'>
        <Progress value={progress} className='rounded-none h-2 rounded-b-sm' />
      </div>
    </div>
  )
}
