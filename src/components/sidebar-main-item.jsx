import clsx from "clsx";
import { memo } from "react";
import { NavLink } from "react-router-dom";

const SidebarMainItem = memo(function SidebarMainItem({ path, icon, label, isExpanded }) {
    const Icon = icon;
    return (
        <NavLink
            to={path}
            className={({ isActive }) =>
                clsx(
                    "py-3 flex items-center justify-start cursor-pointer hover:bg-stone-100 rounded-md transition-all pl-3",
                    isActive ? "bg-stone-200" : "",
                    isExpanded ? "pr-4" : "pr-0"
                )
            }>
            <Icon className="size-8" />
            <span
                className={clsx(
                    "overflow-hidden text-nowrap transition-all font-semibold ml-4",
                    isExpanded ? "xl:w-44 2xl:w-52 md:w-36 " : "w-0"
                )}>
                {label}
            </span>
        </NavLink>
    );
});

export { SidebarMainItem };
