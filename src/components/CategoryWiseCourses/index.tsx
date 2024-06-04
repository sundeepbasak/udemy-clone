"use client";

import { API_URL } from "@/constants/url";
import { useEffect, useState } from "react";
import CoursesByCategory from "./CoursesByCategory";

export default function CategoryWiseCourses() {
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/category`);
        const { data } = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories in Category wise courses");
      }
    };
    getCategories();
  }, []);

  console.log("categories", categories);

  return (
    <>
      {categories &&
        categories.length > 0 &&
        categories.map((category: any) => {
          return (
            <CoursesByCategory key={category.id} category={category.name} />
          );
        })}
    </>
  );
}
