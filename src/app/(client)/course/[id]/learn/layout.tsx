'use client'

import { API_URL } from '@/constants/url'
import Link from 'next/link'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

// shadcn
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useCourseData } from '@/hooks/useCourseData'
import { useSectionsData } from '@/hooks/useSectionsData'
import Spinner from '@/components/Spinner'
import { Separator } from '@/components/ui/separator'
import CourseInfoTab from '@/components/CourseInfoTab'
import usePresignedUrl from '@/hooks/usePresignedUrl'
import Image from 'next/image'
import useWindowSize from '@/hooks/useWindowSize'
import NormalVideoPlayer from '@/components/NormalVideoPlayer'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { toast } from 'react-toastify'
import { Question, Video, VideoLecture } from '@/types/client.types'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isReply, setIsReply] = useState(false)
  const [discussionId, setDiscusionId] = useState<null | string>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [vid, setVid] = useState('')
  // const [sectionId, setSectionId] = useState<string>('')
  const [listOfVideos, setListOfVideos] = useState<any[]>([])
  const [someState, setSomeState] = useState(false)

  const router = useRouter()

  const { id, lectureId } = useParams()

  const { isLoading: isLoadingCourse, data: course } = useCourseData(id, 'cid')
  const { isLoading: isLoadingSections, data: sections } = useSectionsData(
    +id,
    true,
    someState
  )

  const searchParams = useSearchParams()
  const activeVid = searchParams.get('video')
  let activeSid = searchParams.get('section')
  const last_watched_video_progress = searchParams.get('progress')
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    activeSid
  )

  const [accordionValue, setAccordionValue] = useState<any>(activeSid)

  console.log({ activeSid })

  console.log('sections', sections)

  useEffect(() => {
    let videos: any[] = []
    sections?.forEach((section) => {
      const sectionId = section.sid
      if (section.videos && section.videos.length > 0) {
        section.videos.forEach((video) => {
          video.sid = +sectionId
        })
        videos = [...videos, ...section.videos]
      }
    })
    setListOfVideos(videos)
  }, [sections])

  useEffect(() => {
    console.log('list of videos', listOfVideos)
    setActiveSectionId(searchParams.get('section'))
  }, [listOfVideos, searchParams])

  // useEffect(() => {
  //   async function fetchVideo() {
  //     const res = await fetch(`${API_URL}/video/${activeVid}`)
  //     const lecture = await res.json()

  //     console.log('my lecture', { lecture })
  //   }

  //   if (activeVid) {
  //     fetchVideo()
  //   }
  // }, [activeVid])

  // console.log({ activeVid })

  // useEffect(() => {
  //   async function fetchVideoDetails() {
  //     const data = await getVideoDetails(lectureId);

  //     setVideoUrl(data.url);
  //     console.log("video data", data);
  //   }

  //   fetchVideoDetails();
  // }, [lectureId]);

  const key = `course-${id}/${lectureId}`
  const videoUrl = usePresignedUrl(key)
  console.log('video url', videoUrl)
  const windowSize = useWindowSize()
  console.log({ windowSize })

  const fetchQuestionAnswers = useCallback(async () => {
    const res = await fetch(`${API_URL}/course/${id}/discussion`)

    if (res.ok) {
      const data = await res.json()
      console.log('GET discussion', data)
      setQuestions(data.data)
    } else {
      console.error('Discucssion error')
    }
  }, [id])

  useEffect(() => {
    fetchQuestionAnswers()
  }, [fetchQuestionAnswers])

  const defaultStyles = 'py-2 px-4 lg:rounded-l-full'
  const activeStyles = `bg-gray-500 text-white ${defaultStyles}`

  async function handleQuestionPublish(e: any) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const qn_title = formData.get('qn_title')
    const qn_detail = formData.get('qn_detail')

    if (!qn_title) return

    const res = await fetch(`${API_URL}/course/${id}/discussion`, {
      method: 'POST',
      body: JSON.stringify({ qn_title, qn_detail }),
    })

    if (res.ok) {
      const data = await res.json()
      await fetchQuestionAnswers()
      e.target.reset()
    } else {
      throw new Error('Failed question publish')
    }
  }

  function handleReply() {
    setIsReply(!isReply)
  }

  function handleDiscussionReply(discussionId: string) {
    handleReply()

    setDiscusionId(discussionId)
  }

  function handleLectureClick(key: string, vid: string) {
    setVid(vid)
  }

  const playPrevVideo = (currentVideoId: string | null) => {
    if (currentVideoId) {
      const currentIndex = listOfVideos.findIndex(
        (item) => item.vid === +currentVideoId
      )

      const video = listOfVideos[currentIndex - 1]
      const lectureKey = video.url.split('/')[1]

      // setValue(video.sid.toString())

      setAccordionValue(video.sid.toString())

      router.push(
        `/course/${id}/learn/lecture/${lectureKey}?video=${video.vid}&section=${video.sid}`
        // `/course/${id}/learn/lecture/${lectureKey}?video=${video.vid}&section=${activeSid}`
      )
    }
  }

  const playNextVideo = (currentVideoId: string | null) => {
    if (currentVideoId) {
      const currentIndex = listOfVideos.findIndex(
        (item) => item.vid === +currentVideoId
      )

      const video = listOfVideos[currentIndex + 1]
      const lectureKey = video.url.split('/')[1]

      // setValue(video.sid.toString())

      setAccordionValue(video.sid.toString())
      console.log('accordion value', video.sid)
      // setAccordionValue(accordionValue)

      router.push(
        `/course/${id}/learn/lecture/${lectureKey}?video=${video.vid}&section=${video.sid}`
      )
    }
  }

  const handleCheckboxChange = async (
    event: ChangeEvent<HTMLInputElement>,
    video_id: number
  ) => {
    try {
      if (event.target.checked) {
        const res = await fetch(`${API_URL}/course/${id}/complete`, {
          method: 'POST',
          body: JSON.stringify({ video_id }),
        })

        if (res.ok) {
          setSomeState(!someState)
          toast.success('Completed')
        }

        // const data = await res.json()

        // console.log('video complete data', data)
      }
    } catch (error) {
      console.error('error video complete data')
    }
  }

  console.log('-------------------------')

  console.log('question answer', questions)
  console.log('list of videos', listOfVideos)

  console.log('-------------------------')

  return (
    <>
      <div className='container mx-auto lg:pt-5 max-w-full w-[95%] min-h-screen'>
        {course && (
          <div className='flex gap-4 mb-5 items-center'>
            <h2 className='text-2xl font-light'>{course?.title}</h2>
          </div>
        )}
        <div className='flex flex-col lg:flex-row gap-5'>
          <div className='w-full lg:w-4/6'>
            <NormalVideoPlayer
              videoUrl={videoUrl}
              courseId={id}
              sectionId={activeSid}
              videoId={activeVid}
              progress={
                (last_watched_video_progress && +last_watched_video_progress) ||
                0
              }
            />
            <div className='flex gap-3 py-3'>
              <Button
                onClick={() => playPrevVideo(activeVid)}
                variant='outline'
                className='ml-auto'
              >
                <ArrowLeftIcon />
              </Button>
              <Button
                onClick={() => playNextVideo(activeVid)}
                variant='outline'
              >
                <ArrowRightIcon />
              </Button>
              <Button>Mark as complete</Button>
            </div>
            {windowSize.width > 1023 && (
              <CourseInfoTab
                description={course?.description}
                questionAnswers={questions}
                onQuestionPublish={handleQuestionPublish}
              />
            )}
          </div>
          <div className='w-full lg:w-2/6'>
            <div className='p-3 bg-purple-800 text-white mb-3 rounded-sm'>
              Course Content {activeSid} {typeof activeSid}
            </div>
            {isLoadingSections && <Spinner />}
            {sections && (
              <Accordion
                type='single'
                collapsible
                defaultValue={activeSid || undefined}
                onValueChange={(value) => setAccordionValue(value)}
                value={accordionValue || undefined}
              >
                {sections.map((section: any) => (
                  <AccordionItem
                    value={section.sid.toString()}
                    key={section.sid}
                    className='mb-3'
                  >
                    <AccordionTrigger className='hover:bg-gray-100'>
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent className='p-0'>
                      <ul>
                        {section.videos.map((lecture: any) => {
                          const lectureKey = lecture.url.split('/')[1]
                          return (
                            <li
                              key={lecture.url}
                              className={`flex gap-3 items-center text-base px-4 py-4 ${
                                lectureId === lectureKey && 'bg-gray-300'
                              }`}
                              // onClick={() =>
                              //   handleLectureClick(lecture.url, lecture.vid)
                              // }
                            >
                              <input
                                type='checkbox'
                                name='iscomplete'
                                className='border-2 border-gray-600'
                                checked={lecture.completed}
                                disabled={lecture.completed}
                                onChange={(e) =>
                                  handleCheckboxChange(e, lecture.vid)
                                }
                              />
                              <Link
                                href={`/course/${id}/learn/lecture/${lectureKey}?video=${lecture.vid}&section=${section.sid}`}
                              >
                                {lecture.title}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
          {windowSize.width <= 1023 && (
            <CourseInfoTab
              description={course?.description}
              questionAnswers={questions}
              onQuestionPublish={handleQuestionPublish}
            />
          )}
        </div>
      </div>
    </>
  )
}
