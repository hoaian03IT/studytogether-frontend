import { Link } from "react-router-dom";

const SidebarProfileItem = ({ label, link, children }) => {
    return (
        <Link
            to={link}
            className="px-5 py-3 bg-zinc-100 rounded-xl flex gap-[18px] items-center text-zinc-800 hover:bg-zinc-200 transition-all">
            {children}
            <p className="text-base font-semibold">{label}</p>
        </Link>
    );
};

export { SidebarProfileItem };
