import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import logo from "../assets/logo-no-background.png";
import { Link, NavLink } from "react-router-dom";
import englishFlag from "../assets/united-kingdom.png";
import VNFlag from "../assets/vietnam-flag.png";
import { pathname } from "../routes";
import { useState } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import clsx from "clsx";

const languages = [
    { id: "en", name: "English", image: englishFlag },
    { id: "vi", name: "Tiếng Việt", image: VNFlag },
];

export const Header = () => {
    const [language, setLanguage] = useState(languages[0]);
    const [showLanguageOption, setShowLanguageOption] = useState(false);

    const handleSelectLanguage = (language) => {
        setLanguage(language);
        setShowLanguageOption(false);
    };
    return (
        <div className="w-screen bg-cyan-200 fixed top-0 z-50">
            <Navbar maxWidth="xl" className="bg-transparent">
                <NavbarBrand as={Link} to={pathname.home}>
                    <img src={logo} alt="study-together" />
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-6" justify="center">
                    <NavbarItem>
                        <NavLink
                            color="foreground"
                            to={pathname.home}
                            className={({ isActive }) =>
                                clsx("text-xl", isActive ? "underline font-bold" : "font-semibold")
                            }>
                            Trang chủ
                        </NavLink>
                    </NavbarItem>
                    <NavbarItem>
                        <NavLink
                            to={pathname.vocabularySet}
                            className={({ isActive }) =>
                                clsx("text-xl", isActive ? "underline font-bold" : "font-semibold")
                            }>
                            Bộ từ vựng
                        </NavLink>
                    </NavbarItem>
                    <NavbarItem>
                        <NavLink
                            to={pathname.languages}
                            className={({ isActive }) =>
                                clsx("text-xl", isActive ? "underline font-bold" : "font-semibold")
                            }>
                            Ngôn ngữ học
                        </NavLink>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end" className="gap-2">
                    <NavbarItem className="hidden sm:flex">
                        <Popover
                            placement="bottom-start"
                            isOpen={showLanguageOption}
                            onOpenChange={setShowLanguageOption}>
                            <PopoverTrigger>
                                <button className="flex items-center border-none outline-none">
                                    <img src={language.image} alt="" className="size-5 rounded-full" />
                                    <div className="ms-2 flex">
                                        <span>{language.id.toUpperCase()}</span>
                                        <FaSortDown className={showLanguageOption ? "rotate-180 translate-y-2" : ""} />
                                    </div>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="rounded-sm px-0">
                                <div className="py-1 flex flex-col">
                                    {languages.map((language) => {
                                        return (
                                            <button
                                                key={language.id}
                                                className="px-4 py-3 flex items-center hover:bg-blue-50 transition-all"
                                                onClick={() => handleSelectLanguage(language)}>
                                                <img src={language.image} alt="" className="size-5 rounded-full" />
                                                <div className="ms-3 flex items-center">
                                                    <span>
                                                        {language.name} ({language.id.toUpperCase()})
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Popover></Popover>
                    </NavbarItem>
                    <NavbarItem>
                        <Button as={Link} to={pathname.signUp} radius="sm" className="bg-white">
                            Đăng ký
                        </Button>
                    </NavbarItem>
                    <NavbarItem className="hidden lg:flex">
                        <Button as={Link} to={pathname.signIn} radius="sm" className="bg-orange-500 text-white">
                            Đăng nhập
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </div>
    );
};
