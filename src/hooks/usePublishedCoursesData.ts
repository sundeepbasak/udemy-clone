import { API_URL } from "@/constants/url";
import { useEffect, useState, memo } from "react";

const usePublishedCoursesData = (page: number = 1) => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPublishedCourses = async () => {
            const res = await fetch(`${API_URL}/course?page=${page}`);
            if (!res.ok) {
                setIsLoading(false);

                throw new Error("Error fetching draft courses!");
            }

            const { data } = await res.json();

            setData((prev) => [...prev, ...data]);
            setIsLoading(false);
        };

        fetchPublishedCourses();
    }, [page]);

    return { isLoading, data }
}

export default usePublishedCoursesData