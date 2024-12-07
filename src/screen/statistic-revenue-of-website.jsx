import { div } from "framer-motion/client";
import React from "react";
import { FaRegCreditCard } from "react-icons/fa6";
import { PiCrownSimpleBold } from "react-icons/pi";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { BiBook } from "react-icons/bi";

const StatisticRevenueOfWebsite = () => {
	const data = [
		{ date: "2023-01-01", value: 100 },
		{ date: "2023-01-02", value: 150 },
		{ date: "2023-01-03", value: 200 },
		{ date: "2023-01-04", value: 180 },
		{ date: "2023-01-05", value: 220 },
		{ date: "2023-01-06", value: 250 },
		{ date: "2023-01-07", value: 280 },
		{ date: "2023-01-08", value: 300 },
		{ date: "2023-01-09", value: 320 },
		{ date: "2023-01-10", value: 340 },
	];
	return (
		<div className='bg-gray-100 min-h-screen p-6'>
			{/* Top Stats */}
			<div className='grid grid-cols-3 gap-28 mb-6 ml-52 max-w-4xl '>
				<div className='bg-white p-6 rounded shadow '>
					<p className='text-gray-500'>Total Revenue</p>
					<div className='flex gap-4 text-2xl'>
						<FaRegCreditCard />
						<h3 className='text-2xl font-bold'>$13,804.00</h3>
					</div>
				</div>
				<div className='bg-white p-6 rounded shadow'>
					<p className='text-gray-500'>Commission</p>
					<div className='flex gap-4 text-3xl '>
						<PiCrownSimpleBold />
						<h3 className='text-2xl font-bold'>$7,162.00</h3>
					</div>
				</div>
				<div className='bg-white p-6 rounded shadow'>
					<p className='text-gray-500'>Current Balance</p>
					<div className='flex gap-4 text-2xl'>
						<BiBook />
						<h3 className='text-2xl font-bold'>$6,642.00</h3>
					</div>
				</div>
			</div>

			{/* Revenue & Chart */}
			<div className='grid grid-cols-2 gap-6'>
				{/* Revenue Breakdown */}
				<div className='p-6 bg-white rounded-lg shadow-md w-full max-w-md mx-auto'>
					<div className='flex justify-between items-center mb-6'>
						<h2 className='text-xl font-bold'>Revenues</h2>
						<select className='text-sm border rounded-lg p-2'>
							<option>Last 30 Days</option>
							<option>Last 7 Days</option>
							<option>Last Year</option>
						</select>
					</div>

					<div className='text-4xl font-bold mb-4'>
						6,4K
						<span className='text-sm text-green-500 ml-2'>
							+3.4%
						</span>
					</div>

					<div className='h-2 bg-gray-200 rounded-full mb-6'>
						<div
							className='h-2 bg-blue-500 rounded-full'
							style={{ width: "40%" }}></div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div className='p-4 bg-gray-50 rounded-lg'>
							<h3 className='text-sm text-gray-500'>
								Course subscriptions
							</h3>
							<div className='text-lg font-bold'>
								11,1K
								<span className='text-sm text-green-500 ml-2'>
									+3.4%
								</span>
							</div>
						</div>
						<div className='p-4 bg-gray-50 rounded-lg'>
							<h3 className='text-sm text-gray-500'>SPENDING</h3>
							<div className='text-lg font-bold'>
								2,3K
								<span className='text-sm text-green-500 ml-2'>
									+11.4%
								</span>
							</div>
						</div>
						<div className='p-4 bg-gray-50 rounded-lg'>
							<h3 className='text-sm text-gray-500'>REFUND</h3>
							<div className='text-lg font-bold'>
								30
								<span className='text-sm text-red-500 ml-2'>
									-1.4%
								</span>
							</div>
						</div>
						<div className='p-4 bg-gray-50 rounded-lg'>
							<h3 className='text-sm text-gray-500'>INVEST</h3>
							<div className='text-lg font-bold'>
								1,6K
								<span className='text-sm text-green-500 ml-2'>
									+7.0%
								</span>
							</div>
						</div>
					</div>
				</div>
				{/* Asset Chart */}
				<div className='mt-8 bg-white border rounded'>
					<p className='text-gray-500 text-sm mb-2'>
						Asset Generated
					</p>
					<ResponsiveContainer width='100%' height={300}>
						<LineChart data={data}>
							<XAxis dataKey='date' />
							<YAxis />
							<CartesianGrid strokeDasharray='3 3' />
							<Tooltip />
							<Legend />
							<Line
								type='monotone'
								dataKey='value'
								stroke='#8884d8'
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};

export default StatisticRevenueOfWebsite;
