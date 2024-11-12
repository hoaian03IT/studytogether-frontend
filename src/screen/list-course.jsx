import { div } from "framer-motion/client";
import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { RxMagnifyingGlass } from "react-icons/rx";
import { Image } from "@nextui-org/image";
import { FaBookBookmark } from "react-icons/fa6";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaTrophy } from "react-icons/fa6";
import SearchnFilter from '../components/search-filter'; 


const listAmage = [
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
  {
    image: "https://nextui.org/images/hero-card-complete.jpeg",
    label: "Learning historical words and sentences",
    lessons: 6,
    students: 400,
    level: "advanced",
  },
];

const ListCourse = () => {
  return (
    <div className="container max-w-screen-xl py-10 px-4 bg-slate-200">
      <h1 className="text-gray-700 mb p-6 b bg-gradient-to-r from-blue-300 to-red-100 rounded-lg flex text-center">
        LỰA CHỌN BỘ TỪ VỰNG CHO RIÊNG BẠN
      </h1>
      <div>
      <div className="flex py-3 gap-2 justify-end ">
        <Button type="button" className="">
          Tạo khóa
        </Button>
        <div className="flex items-center bg-white  border-1 rounded-[80%]">
          <Input
            type="text"
            radius="sm"
            placeholder=" Tìm kiếm"
            className="col-span-2 row-start-2 border-spacing-2 "
            endContent={
              <RxMagnifyingGlass className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0 size-6" />
            }
          />
        </div>
      </div>
      <SearchnFilter />
      </div>
      
      <div className="py-4 grid xl:grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1">
        {listAmage.map((item, index) => (
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
                <p>student : {item.students}</p>
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
        ))}
      </div>
    </div>
  );
};
export default ListCourse;
