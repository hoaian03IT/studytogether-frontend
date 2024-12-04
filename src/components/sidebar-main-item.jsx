import clsx from "clsx";
import { memo } from "react";
import { NavLink } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";

const SidebarMainItem = memo(function SidebarMainItem({
														  path,
														  icon,
														  label,
														  isExpanded,
														  isTrigger = false,
														  ModelElement,
													  }) {
	const Icon = icon;
	return isTrigger ? (
		<Popover placement="right-start" className="rounded-md">
			<PopoverTrigger>
				<button
					className="py-3 flex text-start items-center justify-start cursor-pointer hover:bg-stone-100 rounded-md transition-all pl-3">
					<Icon className="size-8" />
					<span
						className={clsx(
							"overflow-hidden text-nowrap transition-all font-semibold ml-4",
							isExpanded ? "md:w-32 xl:w-36" : "w-0",
						)}>	
						{label}
					</span>
				</button>
			</PopoverTrigger>
			<PopoverContent className="p-0 rounded-md">
				{ModelElement}
			</PopoverContent>
		</Popover>
	) : (
		<NavLink
			to={path}
			className={({ isActive }) =>
				clsx(
					"py-3 flex items-center justify-start cursor-pointer hover:bg-stone-100 rounded-md transition-all pl-3",
					isActive ? "bg-stone-200" : "",
					isExpanded ? "pr-4" : "pr-0",
				)
			}>
			<Icon className="size-8" />
			<span
				className={clsx(
					"overflow-hidden text-nowrap transition-all font-semibold ml-4",
					isExpanded ? "md:w-32 xl:w-36" : "w-0",
				)}>
				{label}
			</span>
		</NavLink>
	);
});

export { SidebarMainItem };
