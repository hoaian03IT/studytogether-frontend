import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Input, Radio, RadioGroup } from "@nextui-org/react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { TranslationContext } from "../components/providers/TranslationProvider";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../apis/auth.api";
import { pathname } from "../routes";
import { useQueryString } from "../hooks/useQueryString";
import { validationForm } from "../utils/validateForm";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";

const SignUp = () => {
    const queryString = useQueryString();
    const { translation } = useContext(TranslationContext);

    const [email, setEmail] = useState({ value: "", error: "" });
    const [password, setPassword] = useState({ value: "", error: "" });
    const [cfpassword, setcfPassWord] = useState({ value: "", error: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showCfPassword, setShowCfPassword] = useState(false);
    const [role, setRole] = useState("learner");
    const [acceptPolicy, setAcceptPolicy] = useState(false);

    const [user, setUser] = useRecoilState(userState);

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: AuthService.createUserAccount,
        onSuccess: (res) => {
            handleUpdateUserState({ status: res.status, data: res.data });
        },

        onError: async (error) => {
            toast.warn(error.response.data.message);
        },
    });

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
            toast.success(translation("sign-up-page.success-message"));
            navigate(queryString.redirect ? queryString.redirect : pathname.home);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowCfPassword(!showCfPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let canSubmit = true;
        if (!validationForm.email(email.value)) {
            setEmail((prev) => ({ ...prev, error: "Invalid email (maximum 254 character, include username@domain)" }));
            canSubmit = false;
        } else {
            setEmail((prev) => ({ ...prev, error: "" }));
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
        if (password.value !== cfpassword.value) {
            setcfPassWord((prev) => ({ ...prev, error: "Passwords do not match" }));
            canSubmit = false;
        } else {
            setcfPassWord((prev) => ({ ...prev, error: "" }));
        }

        if (!acceptPolicy) {
            toast.warn("You have to accept our policies");
            canSubmit = false;
        }

        if (canSubmit) mutation.mutate({ email: email.value, password: password.value, role });
    };

    const googleLoginSuccessHandler = useGoogleLogin({
        onSuccess: (credentials) => {
            AuthService.googleLogin({ token: credentials.access_token, role })
                .then((res) => {
                    handleUpdateUserState({ status: res.status, data: res.data });
                })
                .catch((err) => {
                    toast.error(err.response.data.message || err.message);
                });
        },
        onError: (err) => {
            toast.error(err.response.data.message || err.message);
        },
    });

    const facebookLoginSuccessHandler = async (response) => {
        const res = await AuthService.facebookLogin({ token: response.accessToken, role });
        handleUpdateUserState({ status: res.status, data: res.data });
    };

    return (
        <form className="w-[60%]" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-2">{translation("sign-up")}</h2>
                <p className="text-sm mb-5 text-gray-600">{translation("sign-up-page.sub-title")}</p>
            </div>
            <div className="flex justify-center items-center">
                <span className="mr-4">You are:</span>
                <RadioGroup
                    orientation="horizontal"
                    color="secondary"
                    defaultValue="learner"
                    onValueChange={setRole}
                    value={role}>
                    <Radio value="learner">Learner</Radio>
                    <Radio value="teacher">Teacher</Radio>
                </RadioGroup>
            </div>
            <div className="mb-4">
                <Input
                    type="text"
                    placeholder="user@example.com"
                    value={email.value}
                    onChange={(e) => setEmail((prev) => ({ ...prev, value: e.target.value }))}
                    className="w-full"
                    size="lg"
                    radius="sm"
                    labelPlacement="outside"
                    label={<p className="text-sm">{translation("sign-up-page.email-label")}</p>}
                    required
                    errorMessage={email.error}
                    isInvalid={!!email.error}
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
                    label={<p className="text-sm">{translation("sign-up-page.password-label")}</p>}
                    required
                    errorMessage={password.error}
                    isInvalid={!!password.error}
                    endContent={
                        <span
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                            {showPassword ? <BsEyeFill className="size-5" /> : <BsEyeSlashFill className="size-5" />}
                        </span>
                    }
                />
            </div>
            <div className="relative mb-5 mt-10">
                <Input
                    type={showCfPassword ? "text" : "password"}
                    placeholder="*************"
                    value={cfpassword.value}
                    onChange={(e) => setcfPassWord((prev) => ({ ...prev, value: e.target.value }))}
                    className="w-full"
                    size="lg"
                    radius="sm"
                    labelPlacement="outside"
                    label={<p className="text-sm">{translation("sign-up-page.confirm-password-label")}</p>}
                    required
                    errorMessage={cfpassword.error}
                    isInvalid={!!cfpassword.error}
                    endContent={
                        <span
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                            {showCfPassword ? <BsEyeFill className="size-5" /> : <BsEyeSlashFill className="size-5" />}
                        </span>
                    }
                />
            </div>
            <div className="flex justify-between mb-4">
                <div className="flex items-center">
                    <Checkbox
                        color="secondary"
                        checked={acceptPolicy}
                        type="checkbox"
                        onChange={(e) => setAcceptPolicy(e.target.checked)}
                        isRequired={true}
                    />
                    <label className="text-sm select-none">
                        {translation("sign-up-page.accept-rules-policies")}&nbsp;
                        <Link to="/" target="_blank" className="underline font-normal">
                            {translation("sign-up-page.policies")}
                        </Link>
                    </label>
                </div>
            </div>
            <Button
                size="lg"
                radius="sm"
                type="submit"
                className="bg-secondary w-full text-white mb-4"
                isLoading={mutation.isPending}>
                {translation("sign-up")}
            </Button>
            <div className="text-center mb-4 font-semibold">{translation("sign-up-page.or")}</div>
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
                    <span>{translation("sign-up-page.sign-up-with-google")}</span>
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
                            <span>{translation("sign-up-page.sign-up-with-facebook")}</span>
                        </Button>
                    )}
                />
            </div>
            <p className="mt-4 text-center text-sm">
                {translation("sign-up-page.had-account")}&nbsp;
                <Link to="/sign-in" className="text-blue-500 underline">
                    {translation("sign-in")}
                </Link>
                &nbsp; {translation("sign-up-page.now")}
            </p>
        </form>
    );
};

export default SignUp;
