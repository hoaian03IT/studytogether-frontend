import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    const handleContinue = () => {
        if (email && code) {
            navigate("/reset-password");
        } else {
            alert("Vui lòng nhập đúng email và mã");
        }
    };

    return (
        <div className="flex justify-center items-center mt-20">
            <div className="w-[400px] bg-white p-8 shadow-small rounded-md">
                <h2 className="text-2xl font-bold mb-2 text-center">Bạn quên mật khẩu?</h2>
                <p className="text-gray-500 text-center mb-14 text-small ">
                    Đừng lo lắng. Chúng tôi sẽ giúp bạn <br /> Trước tiên hãy nhập email của bạn
                </p>

                <div className="mb-4">
                    <Input
                        type="email"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                        size="lg"
                        labelPlacement="outside"
                        label={<p className="text-sm">Email</p>}
                    />
                </div>

                <div className="flex items-center mb-4">
                    <Input
                        type="text"
                        placeholder="Nhận mã"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-[60%] mr-2"
                        size="lg"
                        labelPlacement="outside"
                        label={<p className="text-sm">Nhập mã</p>}
                    />
                    <Button size="lg" className="bg-secondary text-white mt-6">
                        Nhận mã
                    </Button>
                </div>

                <Button size="lg" className="w-full bg-secondary text-white mt-4" onClick={handleContinue}>
                    Tiếp tục
                </Button>
            </div>
        </div>
    );
};

export default ForgotPassword;
