import NewForm from "@/components/NewForm";
import { API_URL } from "@/constants/url";

type CourseEditPageProps = {
  params: {
    courseId: string;
  };
};

async function getCourseData(id: string) {
  try {
    const res = await fetch(`${API_URL}/course/${id}?type=cid`);
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching course data:", error);
  }
}

export default async function CourseEditPage({
  params: { courseId },
}: CourseEditPageProps) {
  const data = await getCourseData(courseId);
  console.log("data from edit page", data);

  return (
    <div>
      <span>{courseId}</span>
      <div>{data?.title}</div>
      <NewForm courseData={data} />
    </div>
  );
}
