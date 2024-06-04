// 'use client'
// import { API_URL } from '@/constants/url'
// import { useParams } from 'next/navigation'
// import { useEffect, useRef, useState, memo } from 'react'
// import videojs from 'video.js'
// import VideoJS from '../VideoJs/index'

// import 'video.js/dist/video-js.css'
// // City
// import '@videojs/themes/dist/city/index.css'

// // Fantasy
// import '@videojs/themes/dist/fantasy/index.css'

// // Forest
// import '@videojs/themes/dist/forest/index.css'

// // Sea
// import '@videojs/themes/dist/sea/index.css'
// import Spinner from '../Spinner'

// function VideoPlayer({ videoUrl }: { videoUrl: string | null }) {
//   console.log('Video Player', videoUrl)
//   const playerRef = useRef(null)

//   const videoJsOptions = {
//     autoplay: true,
//     controls: true,
//     responsive: true,
//     fluid: true,
//     sources: [
//       {
//         src: videoUrl,
//         type: 'video/mp4',
//       },
//     ],
//   }

//   const handlePlayerReady = (player: any) => {
//     playerRef.current = player

//     // You can handle player events here, for example:
//     player.on('waiting', () => {
//       videojs.log('player is waiting')
//     })

//     player.on('timeupdate', () => {
//       videojs.log('hello')
//     })

//     player.on('dispose', () => {
//       videojs.log('player will dispose')
//     })
//   }

//   return (
//     <>
//       {videoUrl ? (
//         <VideoJS
//           options={videoJsOptions}
//           onReady={handlePlayerReady}
//           videoUrl={videoUrl}
//         />
//       ) : (
//         <div className='flex justify-center h-96 items-center'>
//           <Spinner />
//         </div>
//       )}
//     </>
//   )
// }

// export default memo(VideoPlayer)

// /*

// export default function Video({ videoUrl }: { videoUrl: string | null }) {
//   const videoRef = useRef<null | HTMLVideoElement>(null)
//   const { lectureId } = useParams()

//   const [videoData, setVideoData] = useState({
//     currentTime: 0,
//     isPlaying: false,
//   })

//   function handleTimeUpdate() {
//     console.log('inside time update')
//     if (videoData.isPlaying) {
//       setVideoData({
//         ...videoData,
//         currentTime: videoRef.current!.currentTime,
//       })
//     }
//   }

//   function handlePlay() {
//     console.log('play')
//     setVideoData({ ...videoData, isPlaying: true })
//   }

//   async function sendCurrentTime(currentTime: number, isComplete: boolean) {
//     const res = await fetch(`${API_URL}/progress?vid=${lectureId}`, {
//       method: 'PATCH',
//       body: JSON.stringify({
//         progress: currentTime,
//         completed: isComplete,
//       }),
//     })

//     if (res.ok) {
//       console.log('progress sent successfully')
//     } else {
//       console.log('error sending progress')
//     }
//   }

//   useEffect(() => {
//     console.log('currentTime', videoData.currentTime)
//     sendCurrentTime(videoData.currentTime, false)
//   }, [videoData.currentTime])

//   console.log('render')

//   return (
//     <>
//       <div>
//         <div>
//           {videoUrl !== null ? (
//             <video
//               ref={videoRef}
//               src={videoUrl}
//               className='video-js vjs-theme-city'
//               controls
//               onTimeUpdate={handleTimeUpdate}
//               onPlay={handlePlay}
//             />
//           ) : (
//             <p>loading video...</p>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }
// */
