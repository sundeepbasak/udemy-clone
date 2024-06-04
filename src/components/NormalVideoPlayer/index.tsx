'use client'

import { API_URL } from '@/constants/url'
import usePresignedUrl from '@/hooks/usePresignedUrl'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import Spinner from '../Spinner'
import { Button } from '../ui/button'

const NormalVideoPlayer = ({
  videoUrl,
  sectionId,
  courseId,
  videoId,
  progress,
}: {
  videoUrl: string | null
  sectionId: string | null
  courseId: string
  videoId: string | null
  progress: number
}) => {
  const router = useRouter()
  const videoRef = useRef<null | HTMLVideoElement>(null)
  const { lectureId } = useParams()

  const [isVideoReady, setIsVideoReady] = useState(false)
  // const [isEnded, setIsEnded] = useState(false)

  console.log({ videoUrl })
  // const resolvedUrl = usePresignedUrl(videoUrl);

  const [videoData, setVideoData] = useState({
    currentTime: 0,
    isPlaying: false,
    isEnded: false,
  })

  function handleTimeUpdate() {
    console.log('inside time update')
    if (videoData.isPlaying) {
      setVideoData({
        ...videoData,
        currentTime: videoRef.current!.currentTime,
      })
    }
  }

  function handlePlay() {
    console.log('play')
    setVideoData({ ...videoData, isPlaying: true })
  }

  function handleEnd() {
    console.log('end')
    setVideoData({ ...videoData, isEnded: true })
  }

  function handleSeeked() {
    console.log('fjkadlsj fdklfjdas lfjf', videoRef.current?.currentTime)
  }

  const sendCurrentTime = useCallback(
    async function sendCurrentTime(currentTime: number, isComplete: boolean) {
      const res = await fetch(`${API_URL}/video/progress?vid=${videoId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          progress: Math.floor(+currentTime),
          completed: isComplete,
          last_watched_at: new Date().toISOString(),
          section_id: sectionId && +sectionId,
          course_id: +courseId,
        }),
      })

      if (res.ok) {
        console.log('progress sent successfully')
      } else {
        console.log('error sending progress')
      }
    },
    [courseId, sectionId, videoId]
  )

  useEffect(() => {
    console.log('currentTime', videoData.currentTime)
    sendCurrentTime(videoData.currentTime, videoData.isEnded)
  }, [videoData, sendCurrentTime])

  useEffect(() => {
    console.log('videoRef', videoRef.current)

    if (videoRef.current && isVideoReady) {
      videoRef.current.currentTime = progress
    }
  }, [isVideoReady, progress])

  console.log('render')

  if (videoUrl === null) {
    return (
      <div className='h-96 flex justify-center items-center'>
        <Spinner />
      </div>
    )
  }

  function handleNextClick() {}

  function handlePrevClick() {}

  return (
    <>
      <div>
        <div>
          <video
            ref={videoRef}
            src={videoUrl}
            className='w-full h-full'
            controls
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
            onSeeked={handleSeeked}
            onLoadedData={() => setIsVideoReady(true)}
            onEnded={handleEnd}
          />
        </div>
      </div>
    </>
  )
}

export default NormalVideoPlayer
