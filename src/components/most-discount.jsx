import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../react-query/query-keys";
import { toast } from "react-toastify";
import { useContext } from "react";
import { TranslationContext } from "../providers/TranslationProvider";
import { CourseService } from "../apis/course.api";
import { CourseCard } from "./course-card";

export const MostDiscountCourse = ({ limit = "4" }) => {
	const { translation } = useContext(TranslationContext);
	const mostDiscountCourseQuery = useQuery({
		queryKey: [queryKeys.mostPopularCourse],
		queryFn: async () => {
			try {
				const data = await CourseService.fetchMostDiscountCourse(limit);
				return data?.courses;
			} catch (error) {
				toast.error(translation(error?.response?.data?.errorCode));
			}
		},
	});

	return mostDiscountCourseQuery.data?.map((course) => <CourseCard item={course} />);
};
