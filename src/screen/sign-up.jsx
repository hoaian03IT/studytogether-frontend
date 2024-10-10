import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button, Input } from "@nextui-org/react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import axios from "axios";
import { baseURL } from "../config/config";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [UserName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [cfpassword, setcfPassWord] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const axiosInstance = axios.create({ baseURL });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowPassword(!showConfirmPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== cfpassword) {
            setError("Mật khẩu không khớp");
            return;
        }
        try {
            const response = await axiosInstance.post("/register", {
                email: email,
                username: UserName,
                password: password,
            });
            console.log("Sign-up response: ", response);
            if (response.status === 201) {
                // Registration successful, redirect to login page
                navigate("/sign-in");
            } else {
                const message = response.data.message;
                setError(message);
            }
        } catch (error) {
            console.log("ERR", error);
            setError(error.response.data.message);
        }
    };

    return (
        <form className="w-[60%]" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center">
                {/* <div className="bg-secondary rounded-full w-10 h-10 mb-3.5"></div> */}
                <h2 className="text-3xl font-bold mb-2">Đăng ký</h2>
                <p className="text-sm mb-5 text-gray-600">Để tham gia trải nghiệm học tập không giới hạn</p>
            </div>

            <div className="mb-4">
                <Input
                    type="text"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    size="lg"
                    radius="sm"
                    labelPlacement="outside"
                    label={<p className="text-sm">Email</p>}
                    required
                />
            </div>

            <div className="relative mb-5 mt-10">
                <Input
                    type="text"
                    placeholder="username"
                    value={UserName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full"
                    size="lg"
                    radius="sm"
                    labelPlacement="outside"
                    label={<p className="text-sm">Tên đăng nhập</p>}
                    required
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
                    label={<p className="text-sm">Mật khẩu</p>}
                    required
                />
                <span
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                    {showPassword ? <BsEyeFill className="size-5" /> : <BsEyeSlashFill className="size-5" />}
                </span>
            </div>
            <div className="relative mb-5 mt-10">
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="*************"
                    value={cfpassword}
                    onChange={(e) => setcfPassWord(e.target.value)}
                    className="w-full"
                    size="lg"
                    radius="sm"
                    labelPlacement="outside"
                    label={<p className="text-sm">Xác nhận mật khẩu</p>}
                    required
                />
                <span
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                    {showPassword ? <BsEyeFill className="size-5" /> : <BsEyeSlashFill className="size-5" />}
                </span>
            </div>

            <div className="flex justify-between mb-4">
                <div className="flex items-center">
                    <input type="checkbox" id="saveAccount" className="mr-2" />
                    <label htmlFor="saveAccount" className="text-sm">
                        Tôi đồng ý với các chính sách và điều khoản
                    </label>
                </div>
            </div>

            <Button size="lg" radius="sm" type="submit" className="bg-secondary w-full text-white mb-4">
                Đăng ký
            </Button>
            {error && <p className="text-red-500">{error}</p>}

            <div className="text-center mb-4 font-semibold">HOẶC</div>

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
                    <span>Tiếp tục với Google</span>
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
                    <span>Tiếp tục với Facebook</span>
                </Button>
            </div>

            <p className="mt-4 text-center text-sm">
                Bạn đã có tài khoản?&nbsp;
                <Link to="/sign-in" className="text-blue-500 underline">
                    Đăng nhập
                </Link>
                &nbsp;ngay
            </p>
        </form>
    );
};

export default SignUp;
