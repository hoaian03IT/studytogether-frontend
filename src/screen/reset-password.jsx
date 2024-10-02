import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Thêm trạng thái này
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Thêm trạng thái này
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResetPassword = () => {
    if (newPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        navigate("/reset-password-successfully");
      } else {
        alert("Mật khẩu và xác nhận mật khẩu không khớp!");
      }
    } else {
      alert("Vui lòng nhập đầy đủ mật khẩu!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[400px] bg-white p-8 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Đặt lại mật khẩu</h2>
        <p className="text-gray-500 text-center mb-14 text-small">
          Nhập mật khẩu mới của bạn.
        </p>

        {/*  mật khẩu mới */}
        <div className="relative mb-10"> 
          <Input
            type={showPassword ? "text" : "password"} 
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full"
            size="lg"
            labelPlacement="outside"
            label={<p className="text-sm mt-5">Mật khẩu mới</p>}
          />
       
          <span
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
          >
            {showPassword ? <BsEyeFill className="size-5" /> : <BsEyeSlashFill className="size-5" />}
          </span>
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="relative mb-6">
          <Input
            type={showConfirmPassword ? "text" : "password"} 
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full"
            size="lg"
            labelPlacement="outside"
            label={<p className="text-sm mt-4">Xác nhận mật khẩu</p>}
          />
          
          <span
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
          >
            {showConfirmPassword ? <BsEyeFill className="size-5" /> : <BsEyeSlashFill className="size-5" />}
          </span>
        </div>

        {/* reset mk*/}
        <Button
          size="lg"
          className="w-full bg-orange-500 text-white"
          onClick={handleResetPassword}
        >
          Đặt lại mật khẩu
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
