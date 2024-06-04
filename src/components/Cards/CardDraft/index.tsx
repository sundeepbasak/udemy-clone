"use client";

import Image from "next/image";
import Link from "next/link";
import { API_URL } from "@/constants/url";
import { useEffect, useState } from "react";
// import { BiDotsVerticalRounded } from 'react-icons/bi'
import { useThumbnail } from "@/hooks/useThumbnail";
import { CircleDotIcon, Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Course } from "@/types/client.types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

async function getResolvedThumbnail(thumbnail: string) {
  const res = await fetch(`${API_URL}/files/download?key=${thumbnail}`);

  return res.json();
}

export default function CardDraft({
  id,
  title,
  course_slug,
  instructor,
  mrp_price,
  discount,
  is_free,
  thumbnail,
}: Course): JSX.Element {
  const [showAddCurriculum, setShowAddCurriculum] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const router = useRouter();

  const handlePublish = async (courseId: number) => {
    setIsPublishing(true);
    try {
      const res = await fetch(`${API_URL}/course/${courseId}/publish`, {
        method: "POST",
      });

      if (res.ok) {
        setIsPublishing(false);
        toast.success("Successfully published");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.log("Error publishing the course");
      toast.error("Failed to publish the course! Try again later");

      setIsPublishing(false);
    }
  };

  return (
    <div
      className="shadow-md border relative w-[300px]"
      onMouseEnter={() => setShowAddCurriculum(true)}
      onMouseLeave={() => setShowAddCurriculum(false)}
    >
      <div className="w-full h-44 relative">
        <DropdownMenu>
          <DropdownMenuTrigger className="absolute right-0 top-2 z-40">
            <MoreVertical className="text-white cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href={`/admin/dashboard/edit/${id}`}>
              <DropdownMenuItem className="justify-between items-center cursor-pointer">
                Edit <Pencil size={15} className="text-gray-500" />
              </DropdownMenuItem>
            </Link>
            <Link href="/my-account/faq">
              <DropdownMenuItem className="justify-between items-center cursor-pointer">
                Preview <Eye size={15} className="text-gray-500" />
              </DropdownMenuItem>
            </Link>
            <Link href="/my-account/settings">
              <DropdownMenuItem className="justify-between items-center cursor-pointer">
                Settings <Trash2 size={15} className="text-gray-500" />
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <BiDotsVerticalRounded
          size={30}
          color='gray'
          className='absolute right-0 top-0 z-10 cursor-pointer rounded-full'
        /> */}
        {/* <CircleDotIcon /> */}
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-black-rgba z-30"></div>
        <Image
          // src={resolvedThumbnail ? resolvedThumbnail : placeholderImage}
          src={thumbnail}
          alt={title}
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="p-3 flex flex-col justify-between mx-auto min-h-[150px]">
        <div className="">
          {/* <div className='flex justify-between'>
            <span>143 Learners</span>
            <span>9h 2m</span>
          </div> */}
          <Link href={`/course/${course_slug}`}>
            <h5 className="font-semibold text-lg py-1">{title}</h5>
          </Link>
        </div>
        <div className="mt-auto flex justify-between items-center">
          <h6 className="font-semibold mt-2">{instructor}</h6>
          <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-black relative inline-block">
            <span className="relative text-white">
              {is_free ? "Free" : mrp_price}
            </span>
          </span>
        </div>
      </div>
      <div className="flex gap-3 bg-gray-100 py-3 px-2">
        <Button
          disabled={isPublishing}
          onClick={() => handlePublish(id)}
          className=""
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </Button>
        <Button className="">
          <Link href={`/admin/dashboard/add-videos/${id}`}>Add Curriculum</Link>
        </Button>
      </div>
    </div>
  );
}
