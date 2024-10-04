import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";

const Profile = () => {
  const [formValue, setFormValue] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
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
    <div className="bg-white p-8 rounded shadow-md w-full">
      <h1 className="text-2xl font-semibold mb-4 ">Chỉnh sửa hồ sơ</h1>
      <div className="text-gray-700 mb p-6 b bg-gradient-to-r from-blue-300 to-red-100 rounded-lg ">
        Xin chào, Phuong Thao
      </div>
      <div className="flex items-center mb-6">
        <img
          src="https://i.imgur.com/yXOvdOSs.jpg"
          alt="user"
          className="w-16 h-16 rounded-full mr-4"
        />
        <div className="pt-10">
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
              placeholder="Trà"
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
              placeholder="Thảo"
              radius="sm"
              value={formValue.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <Input
              name="email"
              type="text"
              label={<p className="ms-1">Email</p>}
              labelPlacement="outside"
              placeholder="traluongphuongthao@gmail.com"
              radius="sm"
              value={formValue.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <Input
              name="phone"
              type="text"
              label={<p className="ms-1">Số điện thoại</p>}
              labelPlacement="outside"
              placeholder="0854212084"
              radius="sm"
              value={formValue.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-6">
            <Input
              name="password"
              type="password"
              label={<p className="ms-1">Mật khẩu</p>}
              labelPlacement="outside"
              placeholder=" "
              radius="sm"
              value={formValue.password}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex gap-x-8 pl-20 justify-center">
          <Button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mx-8"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-orange-500  px-4 py-2 rounded mx-8"
          >
            Lưu
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
