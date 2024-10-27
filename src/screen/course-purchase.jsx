import React from 'react';
import { IoIosArrowDown } from "react-icons/io";

function Payment() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8 bg-gray-100">
      {/* Left Section: Course Summary */}
      <div className="bg-white p-6 rounded-lg shadow-lg lg:w-1/2 w-full">
        <h3 className="text-xl font-semibold mb-4">Courses 03</h3>
        
        {/* Course Items */}
        <div className="space-y-4">
          <div className="flex items-center border-b pb-4">
            <img src="course-image-1.jpg" alt="Course 1" className="w-16 h-16 rounded mr-4" />
            <div className="flex flex-col">
              <p className="text-gray-600">Khóa của Courtney Henry</p>
              <p className="text-gray-800 font-semibold">1000 Vocabulary for Beginner - Expend your vocab</p>
              <p className="text-orange-600 font-semibold">$13.00</p>
            </div>
          </div>

          <div className="flex items-center border-b pb-4">
            <img src="course-image-2.jpg" alt="Course 2" className="w-16 h-16 rounded mr-4" />
            <div className="flex flex-col">
              <p className="text-gray-600">Khóa của Marvin McKinney</p>
              <p className="text-gray-800 font-semibold">Learn Vocabulary for Programming Masterclass</p>
              <p className="text-orange-600 font-semibold">$89.00</p>
            </div>
          </div>

          <div className="flex items-center">
            <img src="course-image-3.jpg" alt="Course 3" className="w-16 h-16 rounded mr-4" />
            <div className="flex flex-col">
              <p className="text-gray-600">Khóa của Jacob Jones</p>
              <p className="text-gray-800 font-semibold">Instagram Marketing 2021: Complete Guide To Instagram</p>
              <p>
                <span className="text-orange-600 font-semibold">$32.00</span>
                <span className="text-gray-400 line-through ml-2">$62.00</span>
              </p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between text-gray-600">
            <span>Tổng tiền</span>
            <span>$61.97 USD</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Giảm giá</span>
            <span>8%</span>
          </div>
          <div className="flex justify-between text-xl font-semibold mt-4">
            <span>Tổng thanh toán:</span>
            <span>$63.00 USD</span>
          </div>
          <button className="w-full bg-orange-500 text-white py-3 mt-6 rounded-lg font-semibold hover:bg-orange-600 transition">
            Hoàn Tất Thanh Toán
          </button>
        </div>
      </div>

      {/* Right Section: Payment Options */}
      <div className="bg-white p-6 rounded-lg shadow-lg lg:w-1/2 w-full">
        <h3 className="text-xl font-semibold mb-4">Hoặc thanh toán qua thẻ</h3>
        
        {/* Payment Methods */}
        <div className="flex justify-center gap-4 mb-6">
          <img src="paypal-icon.png" alt="PayPal" className="w-12 cursor-pointer" />
          <img src="vnpay-icon.png" alt="VNPAY" className="w-12 cursor-pointer" />
          <img src="qr-code.png" alt="QR Code" className="w-12 cursor-pointer" />
        </div>
        
        {/* Payment Form */}
        <form className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-lg" required />
          <div className="flex gap-4">
            <input type="text" placeholder="1234 1234 1234 1234" className="w-3/5 p-3 border border-gray-300 rounded-lg" required />
            <input type="text" placeholder="MM/YY" className="w-1/5 p-3 border border-gray-300 rounded-lg" required />
            <input type="text" placeholder="CVC" className="w-1/5 p-3 border border-gray-300 rounded-lg" required />
          </div>
          <input type="text" placeholder="Tên chủ thẻ" className="w-full p-3 border border-gray-300 rounded-lg" required />
          <div className='relative'>
          <select className="w-full p-3 mb-20 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2">
            <option>Vietnam</option>
            {/* Additional countries can be added here */}
          </select>
          <IoIosArrowDown className="absolute top-6 right-6 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Xác nhận thanh toán
          </button>
        </form>
      </div>
    </div>
  );
}

export default Payment;


