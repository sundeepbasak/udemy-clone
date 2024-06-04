import { API_URL } from "@/constants/url";
import { useEffect, useState, memo } from "react";

const useDraftCoursesData = (page: number = 1) => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllDraftCourses = async () => {
            const res = await fetch(`${API_URL}/course?isPublished=false&page=${page}`);

            if (!res.ok) {
                setIsLoading(false);

                throw new Error("Error fetching draft courses!");
            }

            const { data } = await res.json();

            setData((prev) => [...prev, ...data]);
            setIsLoading(false);
        };

        fetchAllDraftCourses();
    }, [page]);

    return { isLoading, data }
}

export default useDraftCoursesData