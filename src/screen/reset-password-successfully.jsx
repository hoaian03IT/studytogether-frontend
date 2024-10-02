import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeBack = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-8 pb-40">
      <img src="/src/assets/check.png" alt="reset successfully" />

      <h1 className="text-3xl font-bold mb-4 mt-6">Chào mừng bạn trở lại</h1>
      <p className="text-gray-500 mb-20 text-small ">Hãy tiếp tục khám phá các tính năng của chúng tôi</p>

   
      <a

        className="text-blue-500 font-semibold flex items-center space-x-2 hover:text-blue-700"
      >
        <Link to="/sign-in">Đăng nhập ngay</Link>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  );
};

export default WelcomeBack;
