import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input } from "@nextui-org/react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { TranslationContext } from "../components/providers/TranslationProvider";

const SignIn = () => {
    const { translation } = useContext(TranslationContext);

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form className="w-[60%]">
            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-2">{translation("sign-in-page.title")}</h2>
                <p className="text-small mb-10 text-gray-600">{translation("sign-in-page.sub-title")}</p>
            </div>

            <div>
                <Input
                    type="text"
                    placeholder="user@example.com"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    className="w-full"
                    size="lg"
                    radius="sm"
                    labelPlacement="outside"
                    label={<p className="text-sm">{translation("sign-in-page.username-label")}</p>}
                />
            </div>

            <div className="relative mb-5 mt-10">
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="*************"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                    size="lg"
                    radius="sm"
                    labelPlacement="outside"
                    label={<p className="text-sm">{translation("sign-in-page.password-label")}</p>}
                />
                <span
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                    {showPassword ? <BsEyeFill className="size-5" /> : <BsEyeSlashFill className="size-5" />}
                </span>
            </div>

            <div className="flex justify-between mb-4">
                <div className="flex items-center">
                    <input type="checkbox" id="saveAccount" className="mr-2" />
                    <label htmlFor="saveAccount" className="text-sm">
                        {translation("sign-in-page.save-account")}
                    </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-blue-500 ml-9 underline">
                    {translation("sign-in-page.forgot-password")}
                </Link>
            </div>

            <Button size="lg" radius="sm" className="bg-secondary w-full text-white mb-4">
                {translation("sign-in-page.sign-in-btn")}
            </Button>

            <div className="text-center mb-4 font-semibold uppercase">{translation("sign-in-page.or")}</div>

            <div className="flex flex-col">
                <Button variant="bordered" radius="sm" size="lg" className="border py-3 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="100"
                        height="100"
                        viewBox="0 0 48 48">
                        <path
                            fill="#FFC107"
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        <path
                            fill="#FF3D00"
                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                        <path
                            fill="#4CAF50"
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                        <path
                            fill="#1976D2"
                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    <span> {translation("sign-in-page.sign-in-google")}</span>
                </Button>
                <Button variant="bordered" radius="sm" size="lg" className="border py-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="100"
                        height="100"
                        viewBox="0 0 48 48">
                        <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path>
                        <path
                            fill="#fff"
                            d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
                    </svg>
                    <span>{translation("sign-in-page.sign-in-facebook")}</span>
                </Button>
            </div>

            <p className="mt-4 text-center text-sm">
                {translation("sign-in-page.not-yet-account")}&nbsp;
                <Link to="/sign-up" className="text-blue-500 underline">
                    {translation("sign-in-page.sign-up")}
                </Link>
                &nbsp;{translation("sign-in-page.now")}
            </p>
        </form>
    );
};

export default SignIn;
