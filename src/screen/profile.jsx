import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";

const Profile = () => {
    const [formValue, setFormValue] = useState({
        firstName: "Tra",
        lastName: "Thao",
        phone: "113",
        email: "",
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormValue({
            ...formValue,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("formValue", formValue);
    };

    const handleCancel = () => {
        console.log("Profile edit canceled");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-screen-xl">
                <h1 className="text-2xl font-semibold mb-4">Chỉnh sửa hồ sơ</h1>
                <div className="text-gray-700 mb-6">Xin chào, Phuong Thao</div>
                <div className="flex items-center mb-6">
                    <img src="https://i.imgur.com/yXOvdOSs.jpg" alt="user" className="w-16 h-16 rounded-full mr-4" />
                    <div>
                        <h3 className="text-lg font-medium">Phuong Thao</h3>
                        <p className="text-sm text-gray-600">traluongphuongthao@gmail.com</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-x-4">
                        <div className="mb-4">
                            <Input
                                name="lastName"
                                type="text"
                                label={<p className="ms-1">Họ</p>}
                                labelPlacement="outside"
                                placeholder="Nguyễn"
                                radius="sm"
                                value={formValue.lastName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                name="firstName"
                                type="text"
                                label={<p className="ms-1">Tên</p>}
                                labelPlacement="outside"
                                placeholder="An"
                                radius="sm"
                                value={formValue.firstName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                name="email"
                                value={formValue.email}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Số Điện Thoại</label>
                            <input
                                name="sdt"
                                value={formValue.sdt}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700">Mật khẩu</label>
                            <input
                                type="password"
                                name="matkhau"
                                value={formValue.matkhau}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <Button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
                            Lưu
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
