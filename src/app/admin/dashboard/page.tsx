"use client";
import Link from "next/link";
import Video from "@/components/Video";
import { API_URL } from "@/constants/url";
import Card from "@/components/Cards/Card";
import CardDraft from "@/components/Cards/CardDraft";
// import { Spinner, Tabs } from 'flowbite-react'
import Spinner from "@/components/Spinner";
import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import DraftCoursesContainer from "@/components/DraftCoursesContainer";
import PublishedCoursesContainer from "@/components/PublishedCoursesContainer";

// admin@gmail.com
// pw: secretpassword

const fetchAllDraftCourses = async () => {
  const res = await fetch(`${API_URL}/course?isPublished=false`);

  if (!res.ok) {
    throw new Error("Error fetching draft courses!");
  }

  return res.json();
};

const fetchAllPublishedCourse = async () => {
  const res = await fetch(`${API_URL}/course`);

  if (!res.ok) {
    throw new Error("Error fetching published courses");
  }

  return res.json();
};
// const { data: drafts } = await fetchAllDraftCourses();
// const { data: published } = await fetchAllPublishedCourse();

// async function handlePublish() {
//   setIsSubmitting(true)
//   try {
//     const res = await fetch(`${API_URL}/course/${courseId}/publish`, {
//       method: 'POST',
//     })

//     if (res.ok) {
//       setIsSubmitting(false)
//       toast.success('Successfully published')
//       router.push('/admin/dashboard')
//     }
//   } catch (error) {
//     console.log('Error publishing the course')
//     toast.error('Failed to publish the course! Try again later')

//     setIsSubmitting(false)
//   }
// }

const AdminDashboard = () => {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [published, setPublished] = useState<any[]>([]);
  const [isLoadingDraftCourses, setIsLoadingDraftCourses] = useState(false);
  const [isLoadingPublishedCourses, setIsPublishedDraftCourses] =
    useState(false);

  const fetchAll = useCallback(async () => {
    setIsLoadingDraftCourses(true);
    setIsPublishedDraftCourses(true);

    const draftCourses = fetchAllDraftCourses();
    const publishedCourses = fetchAllPublishedCourse();

    Promise.all([draftCourses, publishedCourses])
      .then((values) => {
        const [draftCourses, publishedCourses] = values;

        setDrafts(draftCourses.data);
        setIsLoadingDraftCourses(false);

        setPublished(publishedCourses.data);
        setIsPublishedDraftCourses(false);
      })
      .catch((error) => {
        console.log("Promise.all error", error);
      });
  }, []);

  useEffect(() => {
    // fetchAll();
  }, [fetchAll]);

  //  useEffect(() => {
  //   const fetchAllDraftCourses = async () => {
  //     const res = await fetch(`${API_URL}/course?isPublished=false`);

  //     if (!res.ok) {
  //       throw new Error("Error fetching draft courses!");
  //     }

  //     const {data} =  await res.json()

  //     setDrafts(data)
  //   };
  //  }, [])

  return (
    <main className="min-h-screen">
      <div className="container mx-auto">
        <header className="flex justify-between items-center py-2">
          <h1 className="text-3xl font-medium">Hi, Admin 👋</h1>
        </header>
        <Tabs defaultValue="draft">
          <TabsList>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
          <TabsContent value="draft">
            <DraftCoursesContainer />
          </TabsContent>
          <TabsContent value="published">
            <PublishedCoursesContainer />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default AdminDashboard;
