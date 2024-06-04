"use client";

import { VideoIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NormalVideoPlayer from "../NormalVideoPlayer";
import usePresignedUrl from "@/hooks/usePresignedUrl";
import PreviewVideoPlayer from "../PreviewVideoPlayer";

export default function CourseSection({
  sections,
  courseData,
}: {
  sections: any;
  courseData: any;
}) {
  // const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-2/5 mb-10">
      {sections && (
        <>
          <div className="flex justify-between mb-2 items-center">
            <div className="font-semibold text-2xl">Contents</div>
            <div>{`${sections.length} sections`}</div>
          </div>
          <Accordion type="multiple">
            {sections.map((section: any) => (
              <AccordionItem
                value={section.sid}
                key={section.sid}
                className="mb-3"
              >
                <AccordionTrigger className="hover:bg-gray-100 font-semibold">{`${section.title}`}</AccordionTrigger>
                <AccordionContent>
                  {section.videos.length === 0 ? (
                    "Not available yet"
                  ) : (
                    <ul>
                      {section.videos.map((video: any) => {
                        console.log({ videoUrl: video.url });
                        return (
                          <li
                            key={video.title}
                            className="flex items-center gap-3 text-base"
                          >
                            <VideoIcon />
                            {video.url ? (
                              <div className="flex justify-between flex-1 items-center">
                                <Dialog>
                                  <DialogTrigger className="underline text-violet-800">
                                    {video.title}
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl rounded-3xl bg-[#0a0a0a] text-white border-0">
                                    <DialogHeader>
                                      <DialogTitle className="py-5">
                                        <div>
                                          <h4 className="text-gray-500">
                                            Course Preview
                                          </h4>
                                          <h3 className="text-2xl font-semibold">
                                            {courseData.title}
                                          </h3>
                                          <h4 className="mt-2">
                                            {video.title}
                                          </h4>
                                        </div>
                                      </DialogTitle>
                                      <DialogDescription>
                                        <PreviewVideoPlayer
                                          videoUrl={video.url}
                                        />
                                      </DialogDescription>
                                    </DialogHeader>
                                  </DialogContent>
                                </Dialog>
                                {/* <a
                                  href={video.url}
                                  target='_blank'
                                  className='text-violet-800 underline'
                                >
                                  {video.title}
                                </a> */}
                                <span className="text-sm">preview</span>
                              </div>
                            ) : (
                              video.title
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
    </div>
  );
}
