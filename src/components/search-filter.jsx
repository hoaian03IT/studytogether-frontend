import React, { useState } from "react";
import {
	Avatar,
	Button,
} from "@nextui-org/react";
import { Image } from "@nextui-org/image";
import { FaBookBookmark, FaTrophy } from "react-icons/fa6";
import { BsFillPeopleFill, BsThreeDots } from "react-icons/bs";
import SearchnFilter from '../components/search-filter'; 

const ListCourse = () => {

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
            <div key={index} className="bg-white rounded-md p-2">
              <Image
                alt="NextUI hero Image"
                src={item.image}
                className="w-full rounded-md"
              />
              <h3 className="line-clamp-1 py-3 ">{item.label}</h3>
              <div className="flex flex-wrap justify-between text-slate-400 py-3">
                <div className="flex gap-2 items-center">
                  <FaBookBookmark />
                  <p>Lesson: {item.lessons}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <BsFillPeopleFill />
                  <p>Student: {item.students}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <FaTrophy />
                  <p>{item.level}</p>
                </div>
              </div>
              <div>
                <Button type="button" className="flex bg-sky-500 ml-3">
                  Bắt đầu
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