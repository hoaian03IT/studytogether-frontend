import { NavLink } from "react-router-dom";
import clsx from "clsx";

const SidebarProfileItem = ({ label, link, children }) => {
	return (
		<NavLink
			to={link}
			className={({ isActive }) => clsx("px-5 py-3 bg-zinc-100 rounded-sm flex gap-[18px] items-center text-zinc-800 hover:bg-gray-200 transition-all", isActive ? "bg-gray-300" : "bg-white")}>
			{children}
			<p className="text-base font-semibold">{label}</p>
		</NavLink>
	);
};

export { SidebarProfileItem };
