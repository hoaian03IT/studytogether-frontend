import React,  { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const SignIn = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/"); 
  };
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen">
   
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-4">
      <div className="">
          <div className="bg-orange-500 rounded-full w-10 h-10 mb-3.5"></div>
        </div>
        <h2 className="text-3xl font-bold mb-2">Đăng nhập</h2>
        <p className="text-medium mb-10 text-gray-600">Để bắt đầu hành trình học tập của bạn</p>

        <input
          type="text"
          placeholder="Email hoặc tên đăng nhập"
          className="border p-3 w-100 mb-5 rounded-[10px] "
        />
        
        <div className="relative mb-5 w-100">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            className="border p-3 w-100 rounded-[10px]"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
          >
            <img
              src={showPassword ? "/src/assets/show.png" : "/src/assets/hidden.png"}
              alt="Toggle password visibility"
              className="w-5 h-5"
            />
          </span>
        </div>


        <div className="flex w-100 mb-4">
          <div className="flex items-center">
            <input type="checkbox" id="saveAccount" className="mr-2" />
            <label htmlFor="saveAccount" className="text-sm">Lưu tài khoản</label>
          </div>
          <a href="#" className="text-sm text-blue-500 ml-9 text-left">Quên mật khẩu</a>
        </div>

        <button className="bg-orange-500 text-white w-1/2 py-3 rounded-[10px] mb-4">
          Đăng nhập
        </button>

        <div className="text-center mb-4 w-80">HOẶC</div>

        <button className='border w-1/2 py-3 flex justify-center items-center mb-4 rounded-[32px]'>
          <img src="/src/assets/google.png" alt="Google" className="mr-2 w-5" />
          Đăng nhập với Google
        </button>
        <button className="border w-1/2 py-3 flex justify-center items-center rounded-[32px]">
          <img src="/src/assets/facebook.png" alt="Facebook" className="mr-3 w-5" />
         <span>Đăng nhập với Facebook</span> 
        </button>

        <p className="mt-4 text-center text-sm">
          Bạn chưa có tài khoản? <Link to="/sign-up" className="text-blue-500">Đăng kí</Link> ngay
        </p>
      </div>

    
      <div className="w-1/2 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-4xl font-bold text-gray-600 hover:text-gray-900"
        >
          <FaTimes />
        </button>
        <img
          src="/src/assets/background.png"
          alt="Study Together"
          className="w-full h-full object-contain mx-auto"
        />
      </div>
    </div>
  );
};

export default SignIn;
