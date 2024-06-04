"use client";
import { useEffect, useState, useCallback } from "react";
import SectionForm from "./SectionForm";
import Section from "./Section";
import { API_URL } from "@/constants/url";
import { useParams, useRouter } from "next/navigation";
// import { Button, Spinner } from "flowbite-react";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function Curriculum() {
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [isEditingExistingSection, setIsEditingExistingSection] =
    useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const { courseId } = useParams();
  const router = useRouter();
  const [isLoadingSection, setIsLoadingSection] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSections = useCallback(async () => {
    setIsLoadingSection(true);

    try {
      const sectionsResponse = await fetch(
        `${API_URL}/course/${courseId}/section?edit=true`
      );
      const { data } = await sectionsResponse.json();

      setSections(data);
      setIsLoadingSection(false);
    } catch (error) {
      console.log("Error fetching Sections", error);
      setIsLoadingSection(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchSections();
  }, [courseId, fetchSections]);

  useEffect(() => {
    console.log(sections);
  });

  function handleClick() {
    setIsEditingSection(true);
  }

  function handleClose() {
    setIsEditingSection(false);
  }

  // async function handlePublish() {
  //   setIsSubmitting(true);
  //   try {
  //     const res = await fetch(`${API_URL}/course/${courseId}/publish`, {
  //       method: "POST",
  //     });

  //     if (res.ok) {
  //       setIsSubmitting(false);
  //       toast.success("Successfully published");
  //       router.push("/admin/dashboard");
  //     }
  //   } catch (error) {
  //     console.log("Error publishing the course");
  //     toast.error("Failed to publish the course! Try again later");

  //     setIsSubmitting(false);
  //   }
  // }

  async function handleAddSection(title: string, description: string) {
    try {
      const response = await fetch(`${API_URL}/course/${courseId}/section`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      fetchSections();
    } catch (error) {
      console.log("Error adding section", error);
    }
  }

  function handleEditExisting() {
    setIsEditingExistingSection(!isEditingExistingSection);
  }

  return (
    <div className="flex flex-col items-start">
      {isLoadingSection && <Spinner />}
      {sections.map((section, index) => (
        <Section
          key={section.id}
          title={section.title}
          sectionId={section.sid}
          index={index}
          courseId={courseId}
          lectures={section.videos}
          onFetchSections={fetchSections}
          editExisting={isEditingExistingSection}
          onEditExisting={handleEditExisting}
        />
      ))}
      {isEditingSection ? (
        <SectionForm onClose={handleClose} onAddSection={handleAddSection} />
      ) : (
        <Button
          variant="outline"
          onClick={handleClick}
          className="border border-black px-3"
        >
          + section
        </Button>
      )}

      {isSubmitting ? (
        <Button className="mt-10">
          <Loader2 className="animate-spin" />
          <span className="pl-3">publishing...</span>
        </Button>
      ) : (
        <Button className="mt-10">
          <Link href="/admin/dashboard">Save as Draft</Link>
        </Button>
      )}
    </div>
  );
}
