import React, { Component } from "react";
import { ImFire } from "react-icons/im";
import { PiTrophyDuotone } from "react-icons/pi";
import { FaBookTanakh, FaMedal } from "react-icons/fa6";
import CanvasJSReact from "@canvasjs/react-charts";
import { BarChart } from "@mui/x-charts/BarChart";
import { Avatar, Progress } from "@nextui-org/react";

const uData = [4, 3, 2, 2, 1, 2, 3];
const pData = [2, 1, 7, 3, 4, 3, 4];
const xLabels = [
	"Mon",
	"Tue",
	"Wed",
	"Thurs",
	"Fri",
	"Sar",
	"Sun",
];

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class ChartComponent extends Component {
	constructor(props) {
		super(props);
		this.state = { dataPoints: [], isLoaded: true };
	}

	componentDidMount() {
		const data2024 = [
			{ x: new Date(2024, 0, 1), y: 50 },
			{ x: new Date(2024, 1, 1), y: 70 },
			{ x: new Date(2024, 2, 1), y: 60 },
			{ x: new Date(2024, 3, 1), y: 90 },
			{ x: new Date(2024, 4, 1), y: 100 },
			{ x: new Date(2024, 5, 1), y: 120 },
			{ x: new Date(2024, 6, 1), y: 130 },
			{ x: new Date(2024, 7, 1), y: 150 },
			{ x: new Date(2024, 8, 1), y: 140 },
			{ x: new Date(2024, 9, 1), y: 160 },
			{ x: new Date(2024, 10, 1), y: 180 },
			{ x: new Date(2024, 11, 1), y: 200 },
		];

		this.setState({
			dataPoints: data2024,
		});
	}

	render() {
		const options = {
			theme: "light2",
			title: {
				text: "Vocabulary Progress",
			},
			axisX: {
				valueFormatString: "MMM YYYY",
			},
			data: [
				{
					type: "line",
					xValueFormatString: "MMM YYYY",
					yValueFormatString: "#,##0.00",
					dataPoints: this.state.dataPoints,
				},
			],
		};

		return (
			<div className="p-6 bg-white rounded-2xl shadow-md">
				{this.state.dataPoints.length ? (
					<CanvasJSChart options={options} />
				) : (
					<p>LoadingThreeDot Chart...</p>
				)}
			</div>
		);
	}
}


const PersonalStatics = () => {

	return (
		<div className="p-8 bg-gray-100 min-h-screen">
			{/* Statistics Section */}
			<div className="flex gap-10 p-4 mb-8">
				<div className=" max-w-[300px]">
					<div className="p-4 bg-white rounded-2xl shadow-md flex items-center mb-8">
						<ImFire className="text-red-500 text-3xl" />
						<div className="flex flex-col ml-4"><p className="text-lg font-semibold mt-2">4</p>
							<p className="text-gray-500">Day Streak </p></div>
					</div>
					<div className="p-4 bg-white rounded-2xl shadow-md flex items-center">
						<FaBookTanakh className="text-green-500 text-3xl" />
						<div className="flex flex-col ml-4"><p className="text-lg font-semibold mt-2">12</p>
							<p className="text-gray-500">Cumulative vocabulary</p></div>
					</div>
				</div>

				<div className="max-w-[300px]">
					<div className="p-4 bg-white rounded-2xl shadow-md flex items-center mb-8">
						<PiTrophyDuotone className="text-blue-500 text-3xl" />
						<div className="flex flex-col ml-4"><p className="text-lg font-semibold mt-2">1511</p>
							<p className="text-gray-500">Cumulative course point </p></div>
					</div>
					<div className="p-4 bg-white rounded-2xl shadow-md flex items-center">
						<FaMedal className="text-orange-500 text-3xl" />
						<div className="flex flex-col ml-4"><p className="text-lg font-semibold mt-2">50</p>
							<p className="text-gray-500">Scored 100% on quiz</p></div>
					</div>
				</div>

				<div className="p-6 bg-white rounded-lg shadow-md">
					<span className="font-bold">Hours Spent</span>
					<BarChart
						width={500}
						height={300}
						series={[
							{ data: pData, label: "Study", id: "pvId" },
							{ data: uData, label: "Quiz", id: "uvId" },
						]}
						xAxis={[{ data: xLabels, scaleType: "band" }]}
						yAxis={[
							{
								id: "yAxis",
								scaleType: "linear",
								min: 0,
								max: 10,
								label: "",
								tickFormat: (value) => `${value / 1000}k`,
							},
						]}
					/>
				</div>
			</div>

			<ChartComponent />
			<div className="mt-12">
				<span className=" text-2xl font-bold">Previous Courses</span></div>
			<div className="p-4 max-w-3xl mt-10 bg-white rounded-lg shadow-lg border border-gray-200">
				<div className="flex">
					{/* Left Section: Image */}
					<div className="flex-shrink-0">
						<img
							src="https://nextui.org/images/hero-card-complete.jpeg"
							alt="Historical Words"
							className="w-40 h-40 rounded-lg object-cover"
						/>
					</div>

					{/* Right Section: Content */}
					<div className="flex-grow pl-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-2">
							Learning historical words and sentences
						</h3>
						<div className="flex items-center text-gray-500 text-sm mb-4">
							<div className="flex items-center mr-4">
								<span className="mr-2">📖</span> Words: 76
							</div>
							<div className="flex items-center mr-4">
								<span className="mr-2">👤</span> Student: 198
							</div>
							<div className="flex items-center">
								<span className="mr-2">🏆</span> Advance
							</div>
						</div>

						{/* Progress Bar */}
						<div className="relative mb-4">
							<Progress color="warning" aria-label="LoadingThreeDot..." value={60}
									  className="max-w-2xl" />
							<div className="flex justify-between text-sm text-gray-500 mt-1">
								<span>Score: 40 / 100</span>
								<span>Learn: 26 / 76</span>
							</div>
						</div>

						{/* Author Info & Button */}
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
								<div>
									<p className="text-sm ml-3 font-semibold text-gray-800">
										Jon Kantner
									</p>
									<p className="text-xs ml-3 text-gray-500">Author</p>
								</div>
							</div>
							<button
								className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600">
								Continue →
							</button>
						</div>
					</div>
				</div>
			</div>

		</div>
	);
};

export default PersonalStatics;
