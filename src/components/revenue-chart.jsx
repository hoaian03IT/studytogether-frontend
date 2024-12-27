import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { convertUTCToLocalTime } from "../utils/convert-utc-to-local-time";

const getHoursFromNow = () => {
	const currentHour = new Date().getHours();
	const hours = Array.from({ length: 24 }, (_, i) => i); // Tạo mảng [0, 1, ..., 23]

	// Sắp xếp lại danh sách giờ, bắt đầu từ giờ hiện tại
	return [...hours.slice(currentHour), ...hours.slice(0, currentHour)];
};
const getDaysFromToday = () => {
	const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const today = new Date().getDay(); // Lấy chỉ số ngày trong tuần (0 = Sunday, 1 = Monday, ...)

	// Xếp lại danh sách ngày, bắt đầu từ hôm nay
	return [...daysOfWeek.slice(today), ...daysOfWeek.slice(0, today)];
};

const getMonthsFromCurrent = () => {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const currentMonth = new Date().getMonth(); // Lấy chỉ số tháng (0 = January, 1 = February, ...)

	// Sắp xếp lại danh sách tháng, bắt đầu từ tháng hiện tại
	return [...months.slice(currentMonth), ...months.slice(0, currentMonth)];
};
export const RevenueChart = ({ list = [], chartBy = "day" }) => {
	const [chartOptions, setChartOptions] = useState({
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
			curve: "smooth",
		},
		markers: {
			size: 2,
		},
		title: {
			text: `Chart by ${chartBy}`,
			align: "left",
		},
		grid: {
			row: {
				colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
				opacity: 0.5,
			},
		},
		xaxis: {
			categories: [],
		},
	});

	const [chartSeries, setChartSeries] = useState([
		{
			name: "Revenue ($)",
			data: [],
		},
	]);

	useEffect(() => {
		if (chartBy === "day") {
			const data = handleByDay(list);
			setChartSeries([{ ...chartSeries[0], data }]);
			setChartOptions({
				...chartOptions,
				xaxis: {
					categories: getHoursFromNow(),
				},
			});
		} else if (chartBy === "week") {
			const data = handleByWeekday(list);
			const categories = getDaysFromToday();
			console.log({ data, categories });
			setChartSeries([{ ...chartSeries[0], data }]);
			setChartOptions({
				...chartOptions,
				xaxis: {
					categories: categories,
				},
			});
		} else if (chartBy === "month") {
			const data = handleByMonth(list);
			const categories = getMonthsFromCurrent();
			console.log({ data, categories });
			setChartSeries([{ ...chartSeries[0], data }]);
			setChartOptions({
				...chartOptions,
				xaxis: {
					categories: categories,
				},
			});
		}
	}, [list, chartBy]);

	const handleByDay = (list) => {
		let data = new Array(24).fill(0); // 24 giờ

		// Gán dữ liệu ban đầu vào các giờ
		list.forEach((transaction) => {
			const createdAt = convertUTCToLocalTime(transaction?.["created at"]);
			const hour = createdAt.getHours();
			data[hour] += Number(transaction?.amount) * (1 - Number(transaction?.["commission rate"]));
		});

		// Tạo mảng cộng dồn và làm tròn
		let newData = [];
		let sum = 0;

		for (let i = 0; i < data.length; i++) {
			sum += data[i];
			newData.push(sum.toFixed(2)); // Làm tròn đến 2 chữ số thập phân
		}

		return newData;
	};

	const handleByWeekday = (list) => {
		let data = new Array(7).fill(0); // 7 ngày

		list.forEach((transaction) => {
			const createdAt = convertUTCToLocalTime(transaction?.["created at"]);
			const dayOfWeek = createdAt.getDay(); // Lấy thứ (0: Chủ Nhật, 1: Thứ Hai, ...)
			data[dayOfWeek] += Number(transaction?.amount) * (1 - Number(transaction?.["commission rate"]));
		});

		// Tạo mảng cộng dồn và làm tròn
		let newData = [];
		let sum = 0;

		for (let i = 0; i < data.length; i++) {
			sum += data[i];
			newData.push(sum.toFixed(2));
		}

		return newData;
	};

	const handleByMonth = (list) => {
		let data = new Array(12).fill(0); // 12 tháng trong năm

		// Gán dữ liệu ban đầu vào các tháng
		list.forEach((transaction) => {
			const createdAt = convertUTCToLocalTime(transaction?.["created at"]);
			const month = createdAt.getMonth(); // Lấy tháng (0: Tháng 1, 1: Tháng 2, ...)
			data[month] += Number(transaction?.amount) * (1 - Number(transaction?.["commission rate"]));
		});

		// Tạo mảng cộng dồn và làm tròn
		let newData = [];
		let sum = 0;

		for (let i = 0; i < data.length; i++) {
			sum += data[i];
			newData.push(sum.toFixed(2)); // Làm tròn đến 2 chữ số thập phân, trả về chuỗi
		}

		return newData;
	};

	return <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={350} />;
};
