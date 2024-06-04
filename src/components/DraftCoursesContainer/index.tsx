"use client";

import { API_URL } from "@/constants/url";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";
import CardDraft from "../Cards/CardDraft";
import useDraftCoursesData from "@/hooks/useDraftCoursesData";

const DraftCoursesContainer = () => {
  const { isLoading, data: drafts } = useDraftCoursesData();

  return (
    <section className="py-2">
      {/* <h2 className="text-2xl py-2">Draft Courses</h2> */}
      {isLoading && <Spinner />}
      <div className="grid grid-cols-1 place-items-center lg:place-items-baseline md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
        {drafts &&
          drafts.map(
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
                <CardDraft
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
    </section>
  );
};

export default DraftCoursesContainer;
