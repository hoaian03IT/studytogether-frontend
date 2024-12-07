import React, { useState } from "react";
import { FaBookBookmark, FaTrophy } from "react-icons/fa6";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import SearchnFilter from "../components/search-filter";
import { Button, Avatar } from "@nextui-org/react";
import { pathname } from "../routes";
import { useNavigate } from "react-router-dom";

const ListCourse = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  const handleFilterResults = (filteredCourses) => {
    setCourses(filteredCourses);
  };

  return (
    <div className="container max-w-screen-xl py-10 px-4 bg-slate-200">
      <h1 className="text-gray-700 mb p-6 b bg-gradient-to-r from-blue-300 to-red-100 rounded-lg flex text-center">
        LỰA CHỌN BỘ TỪ VỰNG CHO RIÊNG BẠN
      </h1>
      <div>
        <SearchnFilter onFilter={handleFilterResults} />
      </div>

      <div className="py-4 grid xl:grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1">
        {courses.length > 0 ? (
          courses.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4">
              <div className="relative w-full">
                <div
                  className={`absolute top-2 left-2 px-3 py-1 rounded-md text-sm font-bold z-10 ${parseFloat(item["price"]) > 0
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                    }`}
                >
                  {parseFloat(item["price"]) > 0 ? (
                    <p>{parseFloat(item["price"]).toFixed(2) % 1 === 0 ? parseInt(item["price"]) : parseFloat(item["price"]).toFixed(1)}$</p>
                  ) : (
                    <p>Free</p>
                  )}
                </div>
                <img
                  alt="Course Thumbnail"
                  src={item["image"]}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>

              <h3 className="line-clamp-1 py-2 text-lg font-semibold text-gray-800">{item.name}</h3>
              <div className="flex flex-wrap justify-between text-slate-400 py-3">
                <div className="flex gap-2 items-center  text-gray-500  ">
                  <FaBookBookmark />
                  <p>{item["number words"]}</p>
                </div>
                <div className="flex gap-2 items-center  text-gray-500">
                  <BsFillPeopleFill />
                  <p> {item["number enrollments"]}</p>
                </div>
                <div className="flex gap-2 items-center  text-gray-500">
                  <FaTrophy />
                  <p>{item["course level name"]}</p>
                </div>
              </div>

              <div className="flex mt-4">
                <div className="flex justify-start">
                  <Avatar src={item["avatar image"]} />
                  <div>
                    <p className="text-sm ml-3 font-semibold text-gray-800">{item["username"]}</p>
                    <p className="text-xs ml-3 text-gray-500">Author</p>
                  </div>
                </div>
                <Button
                  className="px-4 py-2 flex justify-end ml-auto bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600"
                  endContent={<MdOutlineKeyboardDoubleArrowRight />}
                  onClick={() => navigate(`/course-information/${item["course id"]}`)}
                >
                  Start
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default ListCourse;
