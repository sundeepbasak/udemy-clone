import { API_URL } from "@/constants/url";
import Link from "next/link";
import { Course, Topic } from "@/types/client.types";

import Card from "@/components/Cards/Card";
import SimpleSlider from "@/components/Slick";
import CategoryWiseCourses from "@/components/CategoryWiseCourses";
import MyLearning from "@/components/MyLearning/page";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions.utils";
import CourseSlider from "@/components/CourseSlider";

export const dynamic = "force-dynamic";

async function getAllCourses() {
  const res = await fetch(`${API_URL}/course`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getSubCategories() {
  const res = await fetch(`${API_URL}/sub-category`);

  if (!res.ok) {
    throw new Error("Failed to fetch sub categories");
  }

  return res.json();
}

async function getEnrolledCourses() {
  const res = await fetch(`${API_URL}/user/learning`);

  if (!res.ok) {
    throw new Error("Failed to fetch user learning");
  }

  return res.json();
}

async function getPopularCourses() {
  const res = await fetch(`${API_URL}/course/popular`);

  if (!res.ok) {
    throw new Error("Failed to fetch popular courses");
  }

  return res.json();
}

async function getNewReleases() {
  const res = await fetch(`${API_URL}/course/new-releases`);

  if (!res.ok) {
    throw new Error("Failed to fetch popular courses");
  }

  return res.json();
}

const login = false;

export default async function Home() {
  const data = await getServerSession(authOptions);
  // console.log('get user session', data?.user?.name)

  let enrolledCourses = [];
  if (data !== null) {
    const { data: enrCourses } = await getEnrolledCourses();
    enrolledCourses = enrCourses;
  }

  const { data: topics } = await getSubCategories();
  const { data: popularCourses } = await getPopularCourses();
  const { data: newReleases } = await getNewReleases();

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between pb-2">
        <div className="container mx-auto w-[90%]">
          <section className="w-full relative">
            <SimpleSlider />
          </section>
          {login && <MyLearning />}
          <section className="py-5">
            <h2 className="font-semibold text-2xl mb-5">New Releases</h2>
            {/* <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              }}
            >
              {newReleases.map(
                ({
                  id,
                  title,
                  course_slug,
                  instructor,
                  mrp_price,
                  discount,
                  is_free,
                  thumbnail,
                  description,
                  sub_category,
                  category,
                }: Course) => (
                  <Card
                    key={id}
                    id={id}
                    title={title}
                    course_slug={course_slug}
                    instructor={instructor}
                    mrp_price={mrp_price}
                    discount={discount}
                    is_free={is_free}
                    thumbnail={thumbnail}
                    description={description}
                    sub_category={sub_category}
                    category={category}
                  />
                )
              )}
            </div> */}
            <div>
              <CourseSlider>
                {newReleases.map(
                  ({
                    id,
                    title,
                    course_slug,
                    instructor,
                    mrp_price,
                    discount,
                    is_free,
                    thumbnail,
                    description,
                    sub_category,
                    category,
                  }: Course) => (
                    <Card
                      key={id}
                      id={id}
                      title={title}
                      course_slug={course_slug}
                      instructor={instructor}
                      mrp_price={mrp_price}
                      discount={discount}
                      is_free={is_free}
                      thumbnail={thumbnail}
                      description={description}
                      sub_category={sub_category}
                      category={category}
                    />
                  )
                )}
              </CourseSlider>
            </div>
          </section>
          <section className="py-5">
            <h2 className="font-semibold text-2xl">Topics</h2>
            <p>Browse content by the topics that interest you most.</p>
            <div className="grid grid-cols-5 gap-2 py-5">
              {topics &&
                topics.map((topic: Topic) => {
                  return (
                    <Link key={topic.id} href={`/search?q=${topic.name}`}>
                      <div className="flex items-center justify-center gap-2 bg-white shadow-md px-5 py-3 w-64 cursor-pointer border border-gray-300 rounded-md">
                        <span className="text-md truncate">{topic.name}</span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </section>
          <section className="py-5">
            <h2 className="font-semibold text-2xl mb-5">
              Most popular courses
            </h2>
            <div>
              <CourseSlider>
                {newReleases.map(
                  ({
                    id,
                    title,
                    course_slug,
                    instructor,
                    mrp_price,
                    discount,
                    is_free,
                    thumbnail,
                    description,
                    sub_category,
                    category,
                  }: Course) => (
                    <Card
                      key={id}
                      id={id}
                      title={title}
                      course_slug={course_slug}
                      instructor={instructor}
                      mrp_price={mrp_price}
                      discount={discount}
                      is_free={is_free}
                      thumbnail={thumbnail}
                      description={description}
                      sub_category={sub_category}
                      category={category}
                    />
                  )
                )}
              </CourseSlider>
            </div>
          </section>
          <CategoryWiseCourses />
        </div>
      </div>
    </>
  );
}
