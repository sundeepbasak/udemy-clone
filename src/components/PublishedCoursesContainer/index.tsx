"use client";

import { API_URL } from "@/constants/url";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";
import CardDraft from "../Cards/CardDraft";
import useDraftCoursesData from "@/hooks/useDraftCoursesData";
import usePublishedCoursesData from "@/hooks/usePublishedCoursesData";
import Card from "../Cards/Card";
import { Button } from "../ui/button";

const PublishedCoursesContainer = () => {
  const [page, setPage] = useState<number>(1);
  const { isLoading, data: courses } = usePublishedCoursesData(page);

  console.log("page", page);

  return (
    <section className="py-2">
      {/* <h2 className="text-2xl py-2">Draft Courses</h2> */}
      {isLoading && <Spinner />}
      <div className="grid grid-cols-3 gap-4">
        {courses &&
          courses.map(
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
              category,
              sub_category,
            }: any) => (
              <div key={id}>
                <Card
                  id={id}
                  title={title}
                  course_slug={course_slug}
                  instructor={instructor}
                  mrp_price={mrp_price}
                  discount={discount}
                  is_free={is_free}
                  thumbnail={thumbnail}
                  description={description}
                  category={category}
                  sub_category={sub_category}
                />
              </div>
            )
          )}
      </div>
      <Button className="mt-5" onClick={() => setPage((prev) => prev + 1)}>
        {isLoading ? "Loading..." : "Load more"}
      </Button>
    </section>
  );
};

export default PublishedCoursesContainer;
