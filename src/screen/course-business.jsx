import { div } from 'framer-motion/client';
import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const CourseBusiness = () => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isDiscountEnabled, setIsDiscountEnabled] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('price');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <div className=" bg-gray-100 min-h-screen">
    <div className="p-6 bg-white rounded-lg max-w-4xl mx-auto mt-10 shadow-lg">
      {/* Tabs and Switch */}
      <div className="flex justify-between items-center border-b border-gray-300 mb-6 pb-4">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('price')}
            className={`text-lg font-semibold ${
              activeTab === 'price' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'
            }`}
          >
            Thiết lập giá
          </button>
          <button
            onClick={() => setActiveTab('advance')}
            className={`text-lg font-semibold ${
              activeTab === 'advance' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'
            }`}
          >
            Advance Information
          </button>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={isSettingsVisible}
            onChange={() => setIsSettingsVisible(!isSettingsVisible)}
          />
          <div className="w-12 h-6 bg-gray-300 rounded-full peer-focus:ring-2 peer-focus:ring-green-500 transition-all relative">
            <div
              className={`absolute top-0.5 left-1 h-5 w-5 rounded-full transition-all duration-200 ${
                isSettingsVisible ? 'bg-green-500 transform translate-x-6' : 'bg-white'
              }`}
            ></div>
          </div>
        </label>
      </div>

      {isSettingsVisible && (
        <div className="bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Cài đặt giá khóa học</h2>

          {/* Course Name */}
          <div className="mb-6">
            <label className="block font-medium text-gray-600 mb-2">Khóa</label>
            <input
              type="text"
              placeholder="Tên khóa"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Price and Duration */}
          <div className="flex gap-6 mb-6">
            <div className="w-1/2">
              <label className="block font-medium text-gray-600 mb-2">Giá ($) </label>
              <input
                type="number"
                placeholder="$ 00.00"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="w-1/2">
              <label className="block font-medium text-gray-600 mb-2">Thời hạn</label>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200">
                <option value="">Course durations</option>
                <option value="day">Day</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>
          </div>

          {/* Discount Settings */}
          <div className="mb-6">
            <input
              type="checkbox"
              checked={isDiscountEnabled}
              onChange={() => setIsDiscountEnabled(!isDiscountEnabled)}
              className="mr-2"
            />
            <label className="font-medium text-gray-600">Cài đặt giảm giá</label>
          </div>

          {isDiscountEnabled && (
            <div className="flex gap-6 mb-6">
              {/* Discount Percentage */}
              <div className="w-1/3">
                <label className="block font-medium text-gray-600 mb-2">Giảm giá (%)</label>
                <input
                  type="number"
                  placeholder="%00.00"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>

              {/* Start Date */}
              <div className="w-1/3 relative">
                <label className="block font-medium text-gray-600 mb-2">Từ ngày</label>
                <input
                  type="text"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  onFocus={() => setShowDatePicker(true)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
                <FaCalendarAlt
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowDatePicker(true)}
                />
              </div>

              {/* End Date */}
              <div className="w-1/3 relative">
                <label className="block font-medium text-gray-600 mb-2">Đến</label>
                <input
                  type="text"
                  placeholder="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onFocus={() => setShowDatePicker(true)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
                <FaCalendarAlt
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowDatePicker(true)}
                />
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          <div className="flex gap-6 mb-6">
            <div>
              <input type="checkbox" className="mr-2" defaultChecked />
              <label className="font-medium text-gray-600">Nhận thông báo doanh thu</label>
            </div>
            <div>
              <input type="checkbox" className="mr-2" defaultChecked />
              <label className="font-medium text-gray-600">Báo cáo, phân tích theo kỳ</label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
              Hủy
            </button>
            <button className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600">
              Xác Nhận
            </button>
          </div>
        </div>
      )}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Chọn Ngày</h3>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <div className="flex gap-4 justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                onClick={() => setShowDatePicker(false)}
              >
                Đóng
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => {
                  setShowDatePicker(false);
                  setStartDate(selectedDate);
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default CourseBusiness;
