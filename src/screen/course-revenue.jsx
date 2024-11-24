import React, { useState } from "react";
import { Button, Avatar } from "@nextui-org/react";
import { Image } from "@nextui-org/image";
import { BsStarFill, BsStarHalf, BsStar, BsFillPeopleFill, BsEye } from "react-icons/bs";
import { FaFlag, FaClock, FaCommentAlt } from "react-icons/fa";
import { MdPlayCircleFilled } from "react-icons/md";
import { FaStar, FaCommentDots, FaShoppingCart } from "react-icons/fa";
import ReactApexChart from "react-apexcharts";

const continueCourse = [
    {
        image: "https://nextui.org/images/hero-card-complete.jpeg",
        dayUpload: "Uploaded: Jan 21, 2020",
        dayUpdated: "Last Updated: Sep 11, 2021",
        label: "Vocabulary for IELTS students",
        price: 13.99,
        revenue: 131800455.82,
        rating: 4.8,
        totalReviews: 451444,
        author: {
            name: "Kevin Gilbert",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            role: "Author",
        },
    },
];

const MyCourse = () => {
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <>
                {Array(fullStars)
                    .fill()
                    .map((_, idx) => (
                        <BsStarFill key={`full-${idx}`} className="text-yellow-500 text-lg" />
                    ))}
                {halfStar && <BsStarHalf className="text-yellow-500 text-lg" />}
                {Array(emptyStars)
                    .fill()
                    .map((_, idx) => (
                        <BsStar key={`empty-${idx}`} className="text-yellow-500 text-lg" />
                    ))}
            </>
        );
    };

    const statsData = [
        { icon: <BsFillPeopleFill className="text-red-500 text-2xl" />, value: "9,419,418", label: "Students enrolled" },
        { icon: <FaFlag className="text-green-500 text-2xl" />, value: "Beginner", label: "Course level" },
        { icon: <MdPlayCircleFilled className="text-orange-500 text-2xl" />, value: "1,957", label: "Review" },
        { icon: <FaCommentAlt className="text-purple-500 text-2xl" />, value: "51,429", label: "Total Comments" },
        { icon: <FaClock className="text-blue-500 text-2xl" />, value: "19:37:51", label: "Hours" },
        { icon: <BsEye className="text-gray-500 text-2xl" />, value: "76,395,167", label: "Students viewed" },
    ];

    const ratingData = {
        overall: 4.8,
        ratings: [
            { stars: 5, percentage: 67 },
            { stars: 4, percentage: 27 },
            { stars: 3, percentage: 5 },
            { stars: 2, percentage: 1 },
            { stars: 1, percentage: "<1" },
        ],
    };

    const activityData = [
        {
            id: 1,
            user: "Kevin",
            action: "comments on your course",
            time: "Just now",
            icon: <FaCommentDots className="text-orange-500 text-xl" />,
        },
        {
            id: 2,
            user: "John",
            action: "give a 5 star rating on your course",
            course: "2021 ui/ux design with figma",
            time: "5 mins ago",
            icon: <FaStar className="text-orange-500 text-xl" />,
        },
        {
            id: 3,
            user: "Sraboni",
            action: "purchase your course",
            course: "2021 ui/ux design with figma",
            time: "6 mins ago",
            icon: <FaShoppingCart className="text-orange-500 text-xl" />,
        },
        {
            id: 4,
            user: "Arif",
            action: "purchase your course",
            course: "2021 ui/ux design with figma",
            time: "19 mins ago",
            icon: <FaShoppingCart className="text-orange-500 text-xl" />,
        },
    ];
    const [chartOptions] = useState({
        chart: {
            height: 350,
            type: "line",
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "straight",
        },
        title: {
            text: "Product Trends by Month",
            align: "left",
        },
        grid: {
            row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5,
            },
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
        },
    });

    const [chartSeries] = useState([
        {
            name: "Desktops",
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
    ]);

    return (
        <div className="p-6 bg-white rounded-lg max-w-4xl mx-auto mt-10 shadow-lg">
            <div className="max-w-4xl mt-10">
                {continueCourse.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-lg border mb-6">
                        <div className="flex">
                            {/* Left Section: Image */}
                            <div className="flex-shrink-0">
                                <Image
                                    alt={item.label}
                                    src={item.image}
                                    className="w-40 h-40 rounded-lg object-cover"
                                />
                            </div>

                            {/* Right Section: Content */}
                            <div className="flex-grow pl-6">
                                {/* Dates */}
                                <div className="flex gap-16">
                                    <h3 className="text-sm text-gray-500 mb-1">{item.dayUpload}</h3>
                                    <h3 className="text-sm text-gray-500 mb-1 ml-4">{item.dayUpdated}</h3>
                                </div>
                                {/* Course Title */}
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.label}</h3>

                                {/* Author Info */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <Avatar src={item.author.avatar} />
                                        <div className="ml-3">
                                            <p className="text-sm font-semibold text-gray-800">{item.author.name}</p>
                                            <p className="text-xs text-gray-500">{item.author.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        {renderStars(item.rating)}
                                        <p className="text-sm text-gray-500 ml-2">
                                            {item.rating.toFixed(1)} ({item.totalReviews.toLocaleString()} Ratings)
                                        </p>
                                    </div>
                                </div>

                                {/* Course Details */}
                                <div className="grid grid-cols-3 gap-1 items-center">
                                    {/* Course Price */}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">Course Price:</p>
                                        <p className="text-xl font-bold text-gray-800">${item.price.toFixed(2)}</p>
                                    </div>
                                    {/* Revenue */}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">USD Dollar Revenue:</p>
                                        <p className="text-xl font-bold text-gray-800">
                                            ${item.revenue.toLocaleString("en-US")}
                                        </p>
                                    </div>
                                </div>

                                {/* Withdraw Button */}
                                <div className="flex justify-end mt-4">
                                    <Button
                                        className="px-4 py-2 bg-orange-700 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600"
                                    >
                                        Withdraw Money
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow-md">
                {statsData.map((stat, index) => (
                    <div key={index} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                        <div className="p-2 rounded-lg bg-gray-100">{stat.icon}</div>
                        <div className="ml-4">
                            <p className="text-lg font-bold">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-xl font-bold mb-4">Overall Course Rating</h3>
                <div className="flex gap-6">
                    {/* Left Section */}
                    <div className="flex-1 flex flex-col items-center bg-orange-100 p-6 rounded-lg">
                        <p className="text-4xl font-bold">{ratingData.overall}</p>
                        <div className="flex">
                            <BsStarFill className="text-orange-500 text-2xl" />
                            <BsStarFill className="text-orange-500 text-2xl" />
                            <BsStarFill className="text-orange-500 text-2xl" />
                            <BsStarFill className="text-orange-500 text-2xl" />
                            <BsStarHalf className="text-orange-500 text-2xl" />
                        </div>
                        <p className="text-gray-500 text-sm mt-2">Course Rating</p>
                    </div>
                    {/* Right Section */}
                    <div className="flex-2 w-full">
                        <div className="space-y-4">
                            {ratingData.ratings.map((rating, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="flex items-center">
                                        {Array(rating.stars)
                                            .fill()
                                            .map((_, idx) => (
                                                <BsStarFill key={idx} className="text-orange-500 text-lg" />
                                            ))}
                                        {Array(5 - rating.stars)
                                            .fill()
                                            .map((_, idx) => (
                                                <BsStarHalf key={idx} className="text-gray-300 text-lg" />
                                            ))}
                                    </div>
                                    <div className="flex-grow bg-gray-200 h-2 mx-4 rounded-lg relative">
                                        <div
                                            className="bg-orange-500 h-full rounded-lg"
                                            style={{ width: `${rating.percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-500">{rating.percentage}%</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Recent Activity</h3>
                </div>
                <ul className="space-y-4">
                    {activityData.map((activity) => (
                        <li key={activity.id} className="flex items-start">
                            <div className="p-3 bg-orange-100 rounded-lg">{activity.icon}</div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-800">
                                    <span className="font-bold">{activity.user}</span> {activity.action}{" "}
                                    {activity.course && (
                                        <span className="font-semibold text-gray-700">
                                            "{activity.course}"
                                        </span>
                                    )}
                                </p>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-10">
                <div id="chart">
                    <ReactApexChart
                        options={chartOptions} // Đúng: Sử dụng state từ useState
                        series={chartSeries} // Đúng: Sử dụng state từ useState
                        type="line"
                        height={350}
                    />
                </div>
            </div>
        </div>
    );
};

export default MyCourse;
