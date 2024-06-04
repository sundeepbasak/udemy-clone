"use client";

import { API_URL } from "@/constants/url";
import usePresignedUrl from "@/hooks/usePresignedUrl";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Spinner from "../Spinner";

const PreviewVideoPlayer = ({ videoUrl }: { videoUrl: string | null }) => {
  //   const videoRef = useRef<null | HTMLVideoElement>(null);
  //   const { lectureId } = useParams();

  console.log({ videoUrl });
  const resolvedUrl = usePresignedUrl(videoUrl);
  console.log({ resolvedUrl });

  //   const [videoData, setVideoData] = useState({
  //     currentTime: 0,
  //     isPlaying: false,
  //   });

  //   function handleTimeUpdate() {
  //     console.log("inside time update");
  //     if (videoData.isPlaying) {
  //       setVideoData({
  //         ...videoData,
  //         currentTime: videoRef.current!.currentTime,
  //       });
  //     }
  //   }

  //   function handlePlay() {
  //     console.log("play");
  //     setVideoData({ ...videoData, isPlaying: true });
  //   }

  //   async function sendCurrentTime(currentTime: number, isComplete: boolean) {
  //     const res = await fetch(`${API_URL}/progress?vid=${lectureId}`, {
  //       method: "PATCH",
  //       body: JSON.stringify({
  //         progress: currentTime,
  //         completed: isComplete,
  //       }),
  //     });

  //     if (res.ok) {
  //       console.log("progress sent successfully");
  //     } else {
  //       console.log("error sending progress");
  //     }
  //   }

  //   useEffect(() => {
  //     console.log('currentTime', videoData.currentTime)
  //     sendCurrentTime(videoData.currentTime, false)
  //   }, [videoData.currentTime])

  console.log("render preview");

  return (
    <>
      <div>
        <div>
          {resolvedUrl !== null ? (
            <video src={resolvedUrl} className="w-full h-full" controls />
          ) : (
            <div className="h-96 flex justify-center items-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PreviewVideoPlayer;
