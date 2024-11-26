import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { Image } from "@nextui-org/image";
import { FaBookBookmark } from "react-icons/fa6";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaTrophy } from "react-icons/fa6";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Avatar } from "@nextui-org/react";
import { Progress } from "@nextui-org/react";


import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const chartData = {
    datasets: [
      {
        data: [32, 68],
        backgroundColor: ["#4285F4", "#E5E5E5"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: "70%", // Donut size
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const streakDates = [20, 21, 22, 23];
  const today = new Date();

  const startCourse = [
    {
      image: "https://nextui.org/images/hero-card-complete.jpeg",
      label: "Learning historical words and sentences",
      word: 30,
      students: 400,
      level: "Advanced",
      author: {
        name: "Jon Kantner",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        role: "Author",
      },
    },

    {
      image: "https://nextui.org/images/hero-card-complete.jpeg",
      label: "Learning historical words and sentences",
      word: 30,
      students: 400,
      level: "Advanced",
      author: {
        name: "Jon Kantner",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        role: "Author",
      },
    },

    {
      image: "https://nextui.org/images/hero-card-complete.jpeg",
      label: "Learning historical words and sentences",
      word: 30,
      students: 400,
      level: "Advanced",
      author: {
        name: "Jon Kantner",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        role: "Author",
      },
    },

  ];

  const continueCourse = [
    {
      image: "https://nextui.org/images/hero-card-complete.jpeg",
      label: "Learning historical words and sentences",
      words: 76,
      students: 198,
      level: "Advanced",
      score: "40 / 100",
      learned: "26 / 76",
      progress: 60,
      author: {
        name: "Jon Kantner",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        role: "Author",
      },
    },
  ];

  const handleDelete = () => {
    console.log("Delete action triggered");
  };

  return (
    <div className="p-6 ml-8">
      <span className="text-2xl font-bold mt-6 text-primary-500">Recent Courses</span>
      <div className="max-w-xl mt-10 mb-10">
        {continueCourse.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-lg border">
            <div className="flex">
              <div className="flex-shrink-0">
                <Image
                  alt={item.label}
                  src={item.image}
                  className="w-40 h-40 rounded-lg object-cover"
                />
              </div>
              <div className="flex-grow pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.label}
                </h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <div className="flex items-center mr-4">
                    <FaBookBookmark className="mr-2" />
                    Words: {item.words}
                  </div>
                  <div className="flex items-center mr-4">
                    <BsFillPeopleFill className="mr-2" />
                    Student: {item.students}
                  </div>
                  <div className="flex items-center">
                    <FaTrophy className="mr-2" />
                    {item.level}
                  </div>
                </div>
                <div className="relative mb-4">
                  <Progress
                    color="warning"
                    aria-label="Loading..."
                    value={item.progress}
                    className="max-w-2xl"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Score: {item.score}</span>
                    <span>Learn: {item.learned}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar src={item.author.avatar} />
                    <div>
                      <p className="text-sm ml-3 font-semibold text-gray-800">
                        {item.author.name}
                      </p>
                      <p className="text-xs ml-3 text-gray-500">{item.author.role}</p>
                    </div>
                  </div>

                  <Button
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600"
                    endContent={<MdOutlineKeyboardDoubleArrowRight />}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-8 rounded-lg shadow-md mb-12">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="relative w-48 h-48">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-3xl font-bold text-gray-700">32%</h2>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-lg text-gray-700">
              Fluent in <span className="font-bold">🇬🇧 English</span>
            </p>
            <p className="mt-2 text-gray-600">
              Word learned: <span className="font-bold text-blue-600">2210</span>
            </p>
            <p className="text-gray-600">
              Course: <span className="font-bold text-blue-600">44</span>
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-8 md:mt-0">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">My Streak</h3>
          <Calendar
            value={today}
            tileClassName={({ date }) => {
              if (
                streakDates.some(
                  (day) =>
                    new Date(today.getFullYear(), today.getMonth(), day).toDateString() ===
                    date.toDateString()
                )
              ) {
                return "bg-yellow-400 text-white rounded-full";
              }
              return "";
            }}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
      <span className="text-2xl font-bold mt-6 text-primary-500">Most popular Courses</span>
      <div className="py-4 grid xl:grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1 mb-10">
        {startCourse.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-4">
            <Image
              alt="NextUI hero Image"
              src={item.image}
              className="w-full rounded-md"
            />
            <h3 className="line-clamp-1 py-2 text-lg font-semibold text-gray-800 ">{item.label}</h3>
            <div className="flex flex-wrap justify-between text-slate-400 py-3">
              <div className="flex gap-2 items-center text-gray-500">
                <FaBookBookmark />
                <p>Words: {item.word}</p>
              </div>
              <div className="flex gap-2 items-center  text-gray-500">
                <BsFillPeopleFill />
                <p>Student : {item.students}</p>
              </div>
              <div className="flex gap-2 items-center  text-gray-500">
                <FaTrophy />
                <p>{item.level}</p>
              </div>
            </div>
            <div className="flex mt-4">
              <div className="flex justify-start mr-auto">
                <Avatar src={item.author.avatar} />
                <div>
                  <p className="text-sm ml-3 font-semibold text-gray-800">{item.author.name}</p>
                  <p className="text-xs ml-3 text-gray-500">{item.author.role}</p>
                </div>
              </div>
              <div>
                <Button
                  className="px-4 py-2 flex justify-end ml-auto bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600"
                  endContent={<MdOutlineKeyboardDoubleArrowRight />}
                >
                  Start
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
      </div>

      <span className="text-2xl font-bold mt-6 text-primary-500">Top offers and deals</span>
      <div className="py-4 grid xl:grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1 mb-10">
        {startCourse.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-4">
            <div className="relative w-full">
              {/* Nhãn Sale */}
              <div className="absolute top-2 left-2 bg-red-500 text-white font-bold px-3 py-1 rounded-md text-sm z-10">
                30%
              </div>
              {/* Ảnh bìa */}
              <img
                alt="Course Thumbnail"
                src={item.image}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
            <h3 className="line-clamp-1 py-2 text-lg font-semibold text-gray-800 ">{item.label}</h3>
            <div className="flex flex-wrap justify-between text-slate-400 py-3">
              <div className="flex gap-2 items-center text-gray-500">
                <FaBookBookmark />
                <p>Words: {item.word}</p>
              </div>
              <div className="flex gap-2 items-center  text-gray-500">
                <BsFillPeopleFill />
                <p>Student : {item.students}</p>
              </div>
              <div className="flex gap-2 items-center  text-gray-500">
                <FaTrophy />
                <p>{item.level}</p>
              </div>
            </div>
            <div className="flex mt-4">
              <div className="flex justify-start mr-auto">
                <Avatar src={item.author.avatar} />
                <div>
                  <p className="text-sm ml-3 font-semibold text-gray-800">{item.author.name}</p>
                  <p className="text-xs ml-3 text-gray-500">{item.author.role}</p>
                </div>
              </div>
              <div>
                <Button
                  className="px-4 py-2 flex justify-end ml-auto bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600"
                  endContent={<MdOutlineKeyboardDoubleArrowRight />}
                >
                  Start
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>

      </div>
    </div>
  );
};

export default Dashboard;
