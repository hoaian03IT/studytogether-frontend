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
                    "py-3 flex items-center justify-items-center cursor-pointer hover:bg-stone-100 rounded-md transition-all",
                    isActive ? "bg-stone-200" : "",
                    isExpanded ? "px-4" : "px-2"
                )
            }>
            <Icon className="size-8 p-0.5" />
            <span
                className={clsx(
                    "overflow-hidden text-nowrap transition-all font-semibold",
                    isExpanded ? "w-52 ml-4" : "w-0"
                )}>
                {label}
            </span>
        </NavLink>
    );
});

export { SidebarMainItem };
