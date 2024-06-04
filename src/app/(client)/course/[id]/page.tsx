import CourseSection from "@/components/CourseSection";
import EnrollButton from "@/components/EnrollButton";
import { API_URL } from "@/constants/url";
import { CheckCircle2, Dot } from "lucide-react";
import Image from "next/image";

async function getCourseData(id: string) {
  try {
    const res = await fetch(`${API_URL}/course/${id}?type=slug`);
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching course data:", error);
  }
}

async function getEnrollmentStatus(courseId: string) {
  try {
    const res = await fetch(`${API_URL}/course/${courseId}/enrollment-status`);
    const { enrollment_status } = await res.json();
    return enrollment_status;
  } catch (error) {
    console.error("Error fetching enrollment status");
  }
}

async function getSectionsData(courseId: string, edit: boolean = false) {
  try {
    const res = await fetch(`${API_URL}/course/${courseId}/section`);

    const data = await res.json();

    console.log("data", data);

    return data.data;
  } catch (error) {
    console.log("sections error", error);
  }
}

type CoursePageProps = {
  params: {
    id: string;
  };
};

// tiny dots in the backgorund
const dotsBg = {
  backgroundColor: "#000000",
  opacity: 1,
  background: "radial-gradient(#7c7c7c 1px, #000000 1px)",
  backgroundSize: "16px 16px",
};

const CoursePage = async ({ params: { id } }: CoursePageProps) => {
  const courseData = await getCourseData(id);
  const sectionsData = await getSectionsData(courseData.id);
  const enrollmentStatus: boolean = await getEnrollmentStatus(courseData.id);

  const description = courseData.description.split(".")[0];

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between">
        <div style={dotsBg} className="w-full pb-5 min-h-[24rem]">
          <div className="container mx-auto lg:pt-5 max-w-7xl text-white">
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 order-2 lg:order-1 min-h-[24rem] flex flex-col items-center lg:items-start lg:px-0 lg:pr-10 px-5 text-center lg:text-left">
                <h2 className="text-5xl font-semibold mb-5">
                  {courseData.title}
                </h2>
                <p className="mb-4 text-lg">{description}</p>
                <div className="flex gap-8 items-center justify-center">
                  <div>
                    <h3 className="text-sm font-bold">Instructor</h3>
                    <h4 className="text-blue-400 font-semibold">
                      {courseData.instructor}
                    </h4>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Updated at</h3>
                    <h4 className="text-blue-400 font-semibold">
                      May 25, 2023
                    </h4>
                  </div>
                </div>
                <div className="mt-auto py-8 w-full">
                  <div className="">
                    <span className="text-2xl font-medium">
                      {courseData.is_free ? "Free" : courseData.mrp_price}
                    </span>
                  </div>
                  <EnrollButton
                    course={courseData}
                    isEnrolled={enrollmentStatus}
                  />
                </div>
              </div>
              <div className="flex-1 order-1">
                <div className="h-[350px] relative shadow-2xl shadow-black border-slate-100 border-4">
                  <Image
                    src={courseData.thumbnail}
                    alt={courseData.title}
                    fill
                    priority
                    className="object-cover shadow-2xl "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto lg:pt-5 max-w-7xl">
          <div className="flex pt-5 flex-col lg:flex-row w-[90%] lg:w-full mx-auto">
            {courseData && (
              <div className="flex-1 lg:pr-12">
                <div className="border p-7">
                  <h3 className="text-3xl font-medium">
                    What {`you'll`} learn
                  </h3>
                  <ul className="py-2">
                    {courseData.contents
                      .split(".")
                      .map((item: string, index: number) => (
                        <li
                          key={index}
                          className="py-1 flex gap-3 items-center"
                        >
                          <CheckCircle2 size={20} />
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="my-5">
                  <h3 className="text-3xl font-medium">Requirements</h3>
                  <ul className="py-2">
                    {courseData.requirements
                      .split(".")
                      .map((item: string, index: number) => {
                        return (
                          <li key={index} className="flex">
                            <Dot />
                            {item}
                          </li>
                        );
                      })}
                  </ul>
                </div>
                <div className="my-5">
                  <h3 className="text-3xl font-medium">Description</h3>
                  <p className="py-5">{courseData.description}</p>
                </div>
              </div>
            )}
            <CourseSection sections={sectionsData} courseData={courseData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePage;
