"use client";
import { useState } from "react";
import Spinner from "../Spinner";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";
import { API_URL } from "@/constants/url";
import { Button } from "../ui/button";
import { Divide } from "hamburger-react";
import { useSession } from "next-auth/react";
import { Course } from "@/types/client.types";

export default function EnrollButton({
  course,
  isEnrolled,
}: {
  course: Course;
  isEnrolled: boolean;
}) {
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  // const [isEnrolled, setIsEnrolled] = useState(false)
  const router = useRouter();

  const { data: userSession, status } = useSession();

  /* 
  if (status === "authenticated") {
    return <p>Signed in as {session.user.email}</p>
  }

  return <a href="/api/auth/signin">Sign in</a>

  */

  console.log("user session", userSession, status);

  async function handleEnroll() {
    if (status !== "authenticated") {
      console.log("hello");
      router.push("/auth");
    } else {
      setIsLoadingButton(true);
      try {
        const res = await fetch(`${API_URL}/course/${course?.id}/enroll`, {
          method: "POST",
        });
        if (res.ok) {
          toast.success("Enrolled Successfully");
          setIsLoadingButton(false);
          // redirect("/my-courses/learning");
          router.push("/my-courses/learning");
        }
      } catch (error) {
        setIsLoadingButton(false);
        console.log("Error in enrolling to course", error);
      }
    }
  }

  async function addToCart() {}

  function handleGotoCourse() {
    router.push(`/my-courses/learning`);
  }

  return (
    <div>
      {isLoadingButton ? (
        <Button disabled className="rounded-none w-full bg-primary">
          <Spinner />
          <span className="pl-3">Please wait</span>
        </Button>
      ) : (
        <>
          {course.is_free ? (
            <>
              {isEnrolled ? (
                <Button
                  className="rounded-none w-full bg-blue-700 hover:bg-blue-500"
                  onClick={handleGotoCourse}
                >
                  Go to Learning
                </Button>
              ) : (
                <Button
                  onClick={handleEnroll}
                  className="rounded-none w-full bg-blue-700 hover:bg-blue-500"
                >
                  Enroll
                </Button>
              )}
            </>
          ) : (
            <>
              {isEnrolled ? (
                <Button className="rounded-none w-full bg-blue-700 hover:bg-blue-500">
                  Go to Learning
                </Button>
              ) : (
                <Button
                  onClick={addToCart}
                  className="rounded-none w-full bg-blue-700 hover:bg-blue-500"
                >
                  Add to Cart
                </Button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
