import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Input } from "@nextui-org/react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { TranslationContext } from "../components/providers/TranslationProvider";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../apis/auth.api";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { useQueryString } from "../hooks/useQueryString";
import { pathname } from "../routes";
import { validationForm } from "../utils/validateForm";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";

const SignIn = () => {
    const { translation } = useContext(TranslationContext);
    const [user, setUser] = useRecoilState(userState);

    const [usernameOrEmail, setUsernameOrEmail] = useState({ value: "", error: "" });
    const [password, setPassword] = useState({ value: "", error: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [saveAccount, setSaveAccount] = useState(false);

    const navigate = useNavigate();
    const queryString = useQueryString();

    const mutationNormalSubmit = useMutation({
        mutationFn: AuthService.loginUserAccount,
        onSuccess: (res) => handleUpdateUserState({ status: res.status, data: res.data }),
        onError: async (error) => {
            toast.warn(error.response.data.message);
        },
    });

    const mutationFacebookLogin = useMutation({
        mutationFn: AuthService.facebookLogin,
        onSuccess: (res) => handleUpdateUserState({ status: res.status, data: res.data }),
        onError: async (error) => {
            toast.warn(error.response.data.message);
        },
    });

    const mutationGoogleLogin = useMutation({
        mutationFn: AuthService.googleLogin,
        onSuccess: (res) => handleUpdateUserState({ status: res.status, data: res.data }),
        onError: async (error) => {
            toast.warn(error.response.data.message);
        },
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let canSubmit = true;
        if (!validationForm.email(usernameOrEmail.value) && !validationForm.username(usernameOrEmail.value)) {
            setUsernameOrEmail((prev) => ({
                ...prev,
                error: "Invalid email or username",
            }));
            canSubmit = false;
        } else {
            setUsernameOrEmail((prev) => ({ ...prev, error: "" }));
        }
        if (!validationForm.password(password.value)) {
            setPassword((prev) => ({
                ...prev,
                error: "Invalid password (include upper, lower, number and specials, at least 8 characters)",
            }));
            canSubmit = false;
        } else {
            setPassword((prev) => ({ ...prev, error: "" }));
        }

        if (canSubmit)
            mutationNormalSubmit.mutate({ usernameOrEmail: usernameOrEmail.value, password: password.value });
    };

    const handleUpdateUserState = ({ status, data }) => {
        if (user.isLogged) {
            toast.error(translation("error-message"));
            return;
        }
        if (status === 200) {
            setUser({
                info: {
                    username: data.username,
                    phone: data.phone,
                    firstName: data["first name"],
                    lastName: data["last name"],
                    avatar: data["avatar image"],
                    email: data.email,
                    role: data.role,
                },
                token: data.token,
                isLogged: true,
            });
            toast.success(`${translation("sign-in-page.success-message")}, ${data.username}`);
            navigate(queryString.redirect ? queryString.redirect : pathname.home);
        }
    };

    const googleLoginSuccessHandler = useGoogleLogin({
        onSuccess: (credentials) => {
            mutationGoogleLogin.mutate({ token: credentials.access_token });
        },
        onError: (err) => {
            toast.error(err.response.data.message || err.message);
        },
    });

    const facebookLoginSuccessHandler = (response) => {
        console.log(response);
        mutationFacebookLogin.mutate({ token: response.accessToken });
    };
    return (
        <form className="w-[60%]" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-2">{translation("sign-in")}</h2>
                <p className="text-small mb-10 text-gray-600">{translation("sign-in-page.sub-title")}</p>
            </div>

            <div>
                <Input
                    type="text"
                    placeholder="user@example.com"
                    value={usernameOrEmail.value}
                    onChange={(e) => setUsernameOrEmail((prev) => ({ ...prev, value: e.target.value }))}
                    className="w-full"
                    size="lg"
                    radius="sm"
                    labelPlacement="outside"
                    label={<p className="text-sm">{translation("sign-in-page.username-label")}</p>}
                    isInvalid={!!usernameOrEmail.error}
                    errorMessage={usernameOrEmail.error}
                    required
                />
            </div>

            <div className="relative mb-5 mt-10">
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="*************"
                    value={password.value}
                    onChange={(e) => setPassword((prev) => ({ ...prev, value: e.target.value }))}
                    className="w-full"
                    size="lg"
                    radius="sm"
                    labelPlacement="outside"
                    label={<p className="text-sm">{translation("sign-in-page.password-label")}</p>}
                    isInvalid={!!password.error}
                    errorMessage={password.error}
                    required
                    endContent={
                        <span
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                            {showPassword ? <BsEyeFill className="size-5" /> : <BsEyeSlashFill className="size-5" />}
                        </span>
                    }
                />
            </div>

            <div className="flex justify-between mb-4">
                <div className="flex items-center">
                    <Checkbox
                        checked={saveAccount}
                        onChange={(e) => setSaveAccount(e.target.checked)}
                        color="secondary"
                    />
                    <label className="text-sm">{translation("sign-in-page.save-account")}</label>
                </div>
                <Link to="/forgot-password" className="text-sm text-blue-500 ml-9 underline">
                    {translation("sign-in-page.forgot-password")}
                </Link>
            </div>

            <Button
                type="submit"
                size="lg"
                radius="sm"
                className="bg-secondary w-full text-white mb-4"
                isLoading={mutationNormalSubmit.isPending}>
                {translation("sign-in")}
            </Button>

            <div className="text-center mb-4 font-semibold uppercase">{translation("sign-in-page.or")}</div>

            <div className="flex flex-col">
                <Button
                    variant="bordered"
                    radius="sm"
                    size="lg"
                    className="border py-3 mb-4"
                    onClick={googleLoginSuccessHandler}>
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
                <FacebookLogin
                    appId="1710572403124150"
                    onSuccess={facebookLoginSuccessHandler}
                    onFail={(error) => {
                        toast.error(error.response.data.message || error.message);
                    }}
                    render={({ onClick }) => (
                        <Button variant="bordered" radius="sm" size="lg" className="border py-3" onClick={onClick}>
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
                    )}
                />
            </div>

            <p className="mt-4 text-center text-sm">
                {translation("sign-in-page.not-yet-account")}&nbsp;
                <Link to="/sign-up" className="text-blue-500 underline">
                    {translation("sign-up")}
                </Link>
                &nbsp;{translation("sign-in-page.now")}
            </p>
        </form>
    );
};

export default SignIn;
