import React from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { pathname } from "../routes/index.js";

const menuItems = [
	{ path: pathname.courseVocabulary, label: "TỪ VỰNG", icon: "✒️" },
	{ path: pathname.listExamples, label: "VÍ DỤ", icon: "📑" },
	{ path: pathname.listExercise, label: "BÀI TẬP", icon: "📚" },
	{ path: pathname.editCourse, label: "THÔNG TIN KHÓA", icon: "ℹ️" },
	{ path: pathname.courseBusiness, label: "KINH DOANH", icon: "💰" },
];

const CourseBar = () => {
	const params = useParams();

	return (
		<div className="flex justify-center items-center bg-white shadow-lg rounded-lg mt-10">
			{menuItems.map((item) => (
				<NavLink
					to={`${item.path.split(":")[0]}${params?.courseId}`}
					key={item.path}
					className={({ isActive }) =>
						`px-8 py-6 flex items-center transition-colors duration-300 ${
							isActive
								? "bg-blue-100 border-b-4 border-blue-500 font-bold text-blue-600"
								: "text-gray-600 hover:bg-blue-200"
						}`
					}>
					<span className="text-2xl">{item.icon}</span>
					<span>{item.label}</span>
				</NavLink>
			))}
		</div>
	);
};

export default CourseBar;
