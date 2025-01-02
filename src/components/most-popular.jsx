import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../react-query/query-keys";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { TranslationContext } from "../providers/TranslationProvider";
import { CourseService } from "../apis/course.api";
import { CourseCard } from "./course-card";

export const MostPopularCourse = ({ limit = "4" }) => {
	const { translation } = useContext(TranslationContext);
	const [courses, setCourses] = useState([]);
	const mostPopularCourseQuery = useQuery({
		queryKey: [queryKeys.mostPopularCourse],
		queryFn: async () => {
			try {
				const data = await CourseService.fetchMostPopularCourse(limit);
				const courses = data?.courses || [];
				setCourses(courses);
				return courses;
			} catch (error) {
				toast.error(translation(error?.response?.data?.errorCode));
			}
		},
	});

	return courses?.slice(0, Number(limit)).map((course) => <CourseCard key={course?.["course id"]} item={course} />);
};
