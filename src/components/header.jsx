import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import logo from "../assets/logo-no-background.png";
import { Link, NavLink } from "react-router-dom";
import { pathname } from "../routes";
import { useContext, useState } from "react";
import { FaSortDown } from "react-icons/fa";
import clsx from "clsx";
import { TranslationContext } from "./providers/TranslationProvider";

export const Header = ({ fluid = false }) => {
    const { language, toggleLanguageOption, languageSets, translation } = useContext(TranslationContext);
    const [showLanguageOption, setShowLanguageOption] = useState(false);

    const handleSelectLanguage = (language) => {
        toggleLanguageOption(language);
        setShowLanguageOption(false);
    };
    return (
        <div className="sticky top-0 z-50">
            <Navbar maxWidth={fluid ? "full" : "xl"} className="bg-my-primary">
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
                            {translation("header.home")}
                        </NavLink>
                    </NavbarItem>
                    <NavbarItem>
                        <NavLink
                            to={pathname.vocabularySet}
                            className={({ isActive }) =>
                                clsx("text-xl", isActive ? "underline font-bold" : "font-semibold")
                            }>
                            {translation("header.courses")}
                        </NavLink>
                    </NavbarItem>
                    <NavbarItem>
                        <NavLink
                            to={pathname.languages}
                            className={({ isActive }) =>
                                clsx("text-xl", isActive ? "underline font-bold" : "font-semibold")
                            }>
                            {translation("header.learning-language")}
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
                                    {languageSets.map((language) => {
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
                    </NavbarItem>
                    <NavbarItem>
                        <Button as={Link} to={pathname.signUp} radius="sm" className="bg-white">
                            {translation("header.sign-up")}
                        </Button>
                    </NavbarItem>
                    <NavbarItem className="hidden lg:flex">
                        <Button as={Link} to={pathname.signIn} radius="sm" className="bg-secondary">
                            {translation("header.sign-in")}
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </div>
    );
};
