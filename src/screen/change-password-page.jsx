import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";

export default function ChangePasswordPage() {
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    return (
        <div className="flex flex-col items-center">
            <form className="mt-40 bg-white">
                <div>
                    <h2 className="text-4xl">Đặt lại mật khẩu?</h2>
                    <p className="text-sm text-stone-500">Nhập mật khẩu mới của bạn</p>
                </div>
                <div className="mt-20 flex flex-col space-y-12 ">
                    <Input
                        label={<p>Mật khẩu mới</p>}
                        labelPlacement="outside"
                        placeholder="*************"
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        radius="sm"
                    />
                    <Input
                        label={<p>Mật khẩu mới</p>}
                        labelPlacement="outside"
                        placeholder="*************"
                        type="password"
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        radius="sm"
                    />
                </div>
                <Button radius="sm" className="mt-10 w-full text-white bg-orange-500">
                    Đặt lại mật khẩu
                </Button>
            </form>
        </div>
    );
}
