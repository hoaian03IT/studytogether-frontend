import React from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { PiPencilDuotone } from "react-icons/pi";
import { FaBook } from "react-icons/fa";
import { MdAssignmentLate, MdLibraryBooks } from "react-icons/md";
import { LiaSellcast } from "react-icons/lia";
import { pathname } from "../routes/index.js";

const menuItems = [
	{ path: pathname.addVocab, label: "TỪ VỰNG", icon: <PiPencilDuotone className="size-8" /> },
	{ path: pathname.listExamples, label: "VÍ DỤ", icon: <MdAssignmentLate className="size-8" /> },
	{ path: "/exercise-page", label: "BÀI TẬP", icon: <FaBook className="size-6" /> },
	{ path: "/course-details", label: "CHI TIẾT KHÓA", icon: <MdLibraryBooks className="size-8" /> },
	{ path: "/course-business", label: "KINH DOANH", icon: <LiaSellcast className="size-8" /> },
];

const CourseBar = () => {
	const location = useLocation();
	const params = useParams();

	return (
		<div className="flex gap-6 justify-center items-center bg-white shadow-lg rounded-lg mt-10 mr-6 ml-6">
			{menuItems.map((item) => (
				<NavLink
					to={`${item.path.split(":")[0]}${params?.courseId}`}
					key={item.path}
					className={({ isActive }) => `px-6 py-4 flex items-center gap-2 transition-colors duration-300 ${isActive ? "bg-blue-100 border-b-4 border-blue-500 font-bold text-blue-600" : "text-gray-600 hover:bg-blue-200"}`}
				>
					{item.icon}
					<span>{item.label}</span>
				</NavLink>
			))}
		</div>
	);
};

export default CourseBar;
