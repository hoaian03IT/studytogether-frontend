import React, { useState, useEffect } from "react";
import {
	Avatar,
	Button,
} from "@nextui-org/react";
import { Image } from "@nextui-org/image";
import { FaBookBookmark, FaTrophy } from "react-icons/fa6";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import SearchnFilter from '../components/search-filter'; 
import { useMutation } from "@tanstack/react-query";
import { CourseService } from "../apis/course.api";
import { toast } from "react-toastify";

const ListCourse = () => {
	const [courses, setCourses] = useState([]);

	
	const fetchCoursesMutation = useMutation({
		mutationFn: async () => {
			return await CourseService.getCourses(); 
		},
		onSuccess: (data) => {
			
			const formattedCourses = data.map((course) => ({
				image: course["course image"],
				label: course["course name"],
				lessons: course["total words"], 
				students: course["total students"], 
				level: course["course level"], 
				author: {
					avatar: course["author avatar"],
					name: course["author name"],
					role: course["author role"],
				},
			}));
			setCourses(formattedCourses);
		},
		onError: (error) => {
			toast.error("Failed to load courses.");
			console.error("Error fetching courses:", error);
		},
	});

	
	useEffect(() => {
		fetchCoursesMutation.mutate();
	}, []);

	
	const handleFilterResults = (filteredCourses) => {
		setCourses(filteredCourses);
	};

	return (
		<div className="container max-w-screen-xl py-10 px-4 bg-slate-200">
			<h1 className="text-gray-700 mb p-6 b bg-gradient-to-r from-blue-300 to-red-100 rounded-lg flex text-center">
				LỰA CHỌN BỘ TỪ VỰNG CHO RIÊNG BẠN
			</h1>
			<div>
				<SearchnFilter onFilter={handleFilterResults} />
			</div>
			<div className="py-4 grid xl:grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1">
				{courses.length > 0 ? (
					courses.map((item, index) => (
						<div key={index} className="bg-white rounded-md p-2">
							<Image
								alt="Course Image"
								src={item.image}
								className="w-full rounded-md"
							/>
							<h3 className="line-clamp-1 py-3">{item.label}</h3>
							<div className="flex flex-wrap justify-between text-slate-400 py-3">
								<div className="flex gap-2 items-center">
									<FaBookBookmark />
									<p>Words: {item.lessons}</p>
								</div>
								<div className="flex gap-2 items-center">
									<BsFillPeopleFill />
									<p>Students: {item.students}</p>
								</div>
								<div className="flex gap-2 items-center">
									<FaTrophy />
									<p>Level: {item.level}</p>
								</div>
							</div>
							<div className="flex justify-start mr-auto">
								<Avatar src={item.author.avatar} />
								<div>
									<p className="text-sm ml-3 font-semibold text-gray-800">
										{item.author.name}
									</p>
									<p className="text-xs ml-3 text-gray-500">{item.author.role}</p>
								</div>
							</div>
							<div>
								<Button
									className="px-4 py-2 flex justify-end ml-auto bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600"
									endContent={<MdOutlineKeyboardDoubleArrowRight />}
								>
									Start
								</Button>
							</div>
						</div>
					))
				) : (
					<p className="text-center text-gray-500">No courses found.</p>
				)}
			</div>
		</div>
	);
};

export default ListCourse;
