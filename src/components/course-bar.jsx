import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { pathname } from "../routes/index.js";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";

const CourseBar = () => {
	const params = useParams();
	const user = useRecoilValue(userState);

	const menuItems = [
		{ path: pathname.courseVocabulary, label: "TỪ VỰNG", icon: "✒️", permissions: ["learner", "teacher", "admin"] },
		{ path: pathname.listExamples, label: "VÍ DỤ", icon: "📑", permissions: ["learner", "teacher", "admin"] },
		{ path: pathname.listExercise, label: "BÀI TẬP", icon: "📚", permissions: ["teacher", "admin"] },
		{
			path: pathname.editCourse,
			label: "THÔNG TIN KHÓA",
			icon: "ℹ️",
			permissions: ["learner", "teacher", "admin"],
		},
		{ path: pathname.courseBusiness, label: "KINH DOANH", icon: "💰", permissions: ["teacher", "admin"] },
	];

	return (
		<div className="flex justify-center items-center bg-white shadow-lg rounded-lg mt-10">
			{menuItems.map((item) =>
				item.permissions.includes(user.info.role) ? (
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
				) : null,
			)}
		</div>
	);
};

export default CourseBar;
