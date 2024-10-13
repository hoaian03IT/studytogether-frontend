import { Image } from "@nextui-org/image";
import logo from "../assets/logo-no-background.png";
import { Link } from "react-router-dom";
import { IoMdPhonePortrait } from "react-icons/io";
import { IoMailOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useContext, useState } from "react";
import { TranslationContext } from "./providers/TranslationProvider";

export const Footer = () => {
    const { translation } = useContext(TranslationContext);

    const [email, setEmail] = useState("");
    const [comments, setComments] = useState("");

    const handleSubmitComment = (e) => {
        e.preventDefault();
        alert(comments);
    };

    return (
        <footer className="bg-my-primary">
            <div className="container flex justify-between items-start max-w-screen-xl py-4">
                <div>
                    <Image src={logo} alt="StudyTogether" className="w-60" />
                    <p className="text-small ml-2">Master Vocabulary,</p>
                    <p className="text-small translate-x-10">Unlock Your Future</p>
                </div>
                <div>
                    <p className="font-bold mb-3">{translation("footer.course-info.title")}</p>
                    <ul>
                        <li className="text-small mb-1">
                            <Link to="/" className="hover:underline">
                                {translation("footer.course-info.en-course")}
                            </Link>
                        </li>
                        <li className="text-small mb-1">
                            <Link to="/" className="hover:underline">
                                {translation("footer.course-info.vi-course")}
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className="font-bold mb-3">{translation("footer.contact-info.title")}</p>
                    <ul>
                        <li className="flex items-center text-small mb-1">
                            <IoMdPhonePortrait className="size-5" />
                            <span className="ml-1">+84123456789</span>
                        </li>
                        <li className="flex items-center text-small mb-1">
                            <IoMailOutline className="size-5" />
                            <span className="ml-1">stogether73@gmail.com</span>
                        </li>
                        <li className="flex items-center text-small mb-1">
                            <IoLocationOutline className="size-5" />
                            <span className="ml-1">{translation("footer.contact-info.address")}</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <form onSubmit={handleSubmitComment}>
                        <div className="flex flex-col gap-1">
                            <div className="flex gap-1">
                                <Input
                                    type="email"
                                    placeholder={translation("footer.comments.ph-input")}
                                    radius="none"
                                    size="sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Button color="default" radius="none" size="sm" className="text-sm" type="submit">
                                    {translation("footer.comments.btn-send")}
                                </Button>
                            </div>
                            <Textarea
                                size="sm"
                                placeholder={translation("footer.comments.ph-textarea")}
                                radius="none"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
            </div>
            <div className="text-center">
                <p>© 2024 StudyTogether, Com.</p>
            </div>
        </footer>
    );
};
