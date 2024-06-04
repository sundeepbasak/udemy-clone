// 'use client'

// import React, { useEffect, useState } from 'react'
// import videojs from 'video.js'
// import 'video.js/dist/video-js.css'
// // City
// import '@videojs/themes/dist/city/index.css'

// // Fantasy
// import '@videojs/themes/dist/fantasy/index.css'

// // Forest
// import '@videojs/themes/dist/forest/index.css'

// // Sea
// import '@videojs/themes/dist/sea/index.css'
// import { API_URL } from '@/constants/url'
// import { useParams } from 'next/navigation'

// export const VideoJS = (props) => {
//   console.log({ props })
//   const videoRef = React.useRef(null)
//   const playerRef = React.useRef(null)
//   const { options, onReady } = props
//   const { id: courseId, lectureId } = useParams()

//   console.log({ lectureId })
//   const [videoDetails, setVideoDetails] = useState({
//     completed: false,
//   })

//   async function sendCurrentStatus(
//     currentTime: number,
//     completed: boolean,
//     last_watched_at: string
//   ) {
//     console.log(`${API_URL}/progress?cid=${courseId}&vid=${lectureId}`)
//     // const res = await fetch(
//     //   `${API_URL}/progress?cid=${courseId}&vid=${lectureId}`,
//     //   {
//     //     method: 'PATCH',
//     //     body: JSON.stringify({
//     //       progress: currentTime.toFixed(2),
//     //       completed: completed,
//     //       last_watched_at,
//     //     }),
//     //   }
//     // )

//     // if (res.ok) {
//     //   console.log('progress sent successfully')
//     // } else {
//     //   console.log('error sending progress')
//     // }
//   }

//   const handleTimeUpdate = async () => {
//     const player = playerRef.current
//     if (player) {
//       const currentTime = player.currentTime()
//       // console.log({ currentTime })

//       const last_watched_at = new Date(Date.now()).toISOString()
//       // console.log({ completed: videoDetails.completed })

//       sendCurrentStatus(currentTime, videoDetails.completed, last_watched_at)
//     }
//   }

//   useEffect(() => {
//     // Make sure Video.js player is only initialized once
//     if (!playerRef.current) {
//       // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
//       const videoElement = document.createElement('video-js')

//       videoElement.classList.add('vjs-big-play-centered')
//       videoElement.classList.add('vjs-theme-forest')
//       console.log('*******************', 'vjs-theme-fantasy')
//       videoRef.current.appendChild(videoElement)

//       const player = (playerRef.current = videojs(videoElement, options, () => {
//         videojs.log('player is ready')
//         onReady && onReady(player)

//         player.on('timeupdate', handleTimeUpdate)

//         player.on('ended', () => {
//           console.log('ended')
//           setVideoDetails((prev) => ({
//             ...prev,
//             completed: true,
//           }))
//         })
//       }))

//       // You could update an existing player in the `else` block here
//       // on prop change, for example:
//     } else {
//       console.log('else part')
//       document
//         .getElementsByTagName('video-js')[0]
//         .classList.add('vjs-theme-forest')
//       const player = playerRef.current

//       player.autoplay(options.autoplay)
//       player.src(options.sources)
//     }
//   }, [options, videoRef, onReady])

//   // Dispose the Video.js player when the functional component unmounts
//   React.useEffect(() => {
//     const player = playerRef.current

//     return () => {
//       if (player && !player.isDisposed()) {
//         console.log('return disposed')
//         player.dispose()
//         playerRef.current = null
//       }
//     }
//   }, [playerRef])

//   return (
//     <div data-vjs-player>
//       <div ref={videoRef} />
//     </div>
//   )
// }

// export default VideoJS
