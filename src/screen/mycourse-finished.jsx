import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CourseService } from "../apis/course.api.js";
import { toast } from "react-toastify";
import { Button, Avatar } from "@nextui-org/react";
import { FaBookBookmark, FaTrophy } from "react-icons/fa6";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Image } from "@nextui-org/image";

const FinishedCourse = () => {
  const [completedCourses, setCompletedCourses] = useState([]);
  const { mutate, data, isLoading } = useMutation({
    mutationFn: CourseService.fetchUnfinishedCourses, 
    onError: (error) => {
      console.error(error);
			toast.error(translation(error.response?.data?.errorCode));
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    if (data) {
      setCompletedCourses(data.completeCourses || []);
    }
  }, [data]);

  return (
    <div className="container max-w-screen-xl py-10 px-4 mt-20 bg-gray-100">
      
      <div className="py-4 grid xl:grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : completedCourses.length > 0 ? (
          completedCourses.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-lg border ">
              <div className="relative w-full">
                <img
                  alt="course thumbnail"
                  src={item["image"] || "https://via.placeholder.com/150"}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="line-clamp-1 py-2 text-lg font-semibold text-gray-800">
                {item["name"]}
              </h3>
              <div className="flex flex-wrap justify-between text-slate-400 py-3">
                <div className="flex gap-2 items-center text-gray-500">
                  <FaBookBookmark />
                  <p>{item["totalWords"]}</p>
                </div>
                <div className="flex gap-2 items-center text-gray-500">
                  <BsFillPeopleFill />
                  <p>0</p>
                </div>
                <div className="flex gap-2 items-center text-gray-500">
                  <FaTrophy />
                  <p>{item["course level name"]}</p>
                </div>
              </div>
              <div className="flex mt-4">
                <div className="flex justify-start">
                  <Avatar src={item["avatar image"]} />
                  <div>
                    <p className="text-sm ml-3 font-semibold text-gray-800">
                      {item["username"]}
                    </p>
                    <p className="text-xs ml-3 text-gray-500">Author</p>
                  </div>
                </div>
                <Button
                  className="px-4 py-2 flex justify-end ml-auto bg-green-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-green-600"
                  endContent={<MdOutlineKeyboardDoubleArrowRight />}
                  disabled
                >
                  Completed
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

export default FinishedCourse;
