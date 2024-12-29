import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../react-query/query-keys";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { TranslationContext } from "../providers/TranslationProvider";
import { CourseService } from "../apis/course.api";
import { CourseCard } from "./course-card";

export const MostDiscountCourse = ({ limit = "4" }) => {
	const { translation } = useContext(TranslationContext);

	const [courses, setCourses] = useState([]);

	const mostDiscountCourseQuery = useQuery({
		queryKey: [queryKeys.mostDiscountCourse],
		queryFn: async () => {
			try {
				const data = await CourseService.fetchMostDiscountCourse(limit);
				const courses = data?.courses || [];
				setCourses(courses);
				return courses;
			} catch (error) {
				toast.error(translation(error?.response?.data?.errorCode));
			}
		},
	});

	return mostDiscountCourseQuery.data?.map((course) => <CourseCard item={course} />);
};
