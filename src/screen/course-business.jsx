import { AiFillCrown } from "react-icons/ai";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../react-query/query-keys.js";
import { useParams } from "react-router-dom";
import { CourseService } from "../apis/course.api.js";
import { Button, DatePicker, Input } from "@nextui-org/react";
import { userState } from "../recoil/atoms/user.atom.js";
import { GlobalStateContext } from "../providers/GlobalStateProvider.jsx";
import { useRecoilValue } from "recoil";
import { TranslationContext } from "../providers/TranslationProvider.jsx";
import { toast } from "react-toastify";
import { Revenue } from "../screen/course-revenue.jsx";
import { parseDate } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

const CourseBusiness = () => {
	const params = useParams();
	const clientQuery = useQueryClient();
	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);

	const dateFormatter = useDateFormatter({
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	});

	const coursePriceQuery = useQuery({
		queryKey: [queryKeys.coursePrice, params?.courseId],
		queryFn: async () => {
			try {
				let data = await CourseService.fetchCoursePrices(params?.courseId, user, updateUserState);
				initData(data);
				return data;
			} catch (error) {
				console.error(error);
				toast.error(translation(error.response.data?.errorCode));
			}
		},
		initialData: clientQuery.getQueryData([queryKeys.coursePrice, params?.courseId]),
		enabled: !clientQuery.getQueryData([queryKeys.coursePrice, params?.courseId]),
	});

	const [price, setPrice] = useState(0);
	const [discount, setDiscount] = useState(0);
	const [isSettingsVisible, setIsSettingsVisible] = useState(false);
	const [isDiscountEnabled, setIsDiscountEnabled] = useState(false);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [activeTab, setActiveTab] = useState("price");
	const [validInputs, setValidInputs] = useState({
		price: { isValid: true, errMsg: "" },
		discount: { isValid: true, errMsg: "" },
		startDate: { isValid: true, errMsg: "" },
		endDate: { isValid: true, errMsg: "" },
	});

	useEffect(() => {
		if (!isDiscountEnabled) {
			setDiscount(0);
			setStartDate(null);
			setEndDate(null);
		}
	}, [isDiscountEnabled]);

	useEffect(() => {
		if (price <= 0) {
			setIsDiscountEnabled(false);
			setDiscount(0);
			setStartDate(null);
			setEndDate(null);
		}
	}, [price]);

	useEffect(() => {
		initData(coursePriceQuery.data);
	}, [coursePriceQuery.data]);

	const updatePriceCourseMutation = useMutation({
		mutationFn: async (payload) => {
			return await CourseService.updateCoursePrice(payload, user, updateUserState);
		},
		onSuccess: (data) => {
			toast.success(translation(data?.["messageCode"]));
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error.response.data?.["errorCode"]));
		},
	});

	const handleUnCheck = () => {
		if (isSettingsVisible) {
			setIsSettingsVisible(false);
			setPrice(0);
			setDiscount(0);
			setEndDate(null);
			setStartDate(null);
			updatePriceCourseMutation.mutate({
				courseId: params?.courseId,
				newPrice: 0,
				newDiscount: 0,
				discountFrom: null,
				discountTo: null,
				currency: "USD",
			});
		} else {
			setIsSettingsVisible(true);
		}
	};

	const initData = (data) => {
		if (data?.["price id"] > 0) {
			setPrice(data?.["price"]);
			setIsSettingsVisible(data?.["price"] > 0);
			setIsDiscountEnabled(data?.["discount"] > 0);
			if (data?.["discount"] > 0) {
				setDiscount(data?.["discount"]);
				setStartDate(parseDate(data?.["discount from"]));
				setEndDate(parseDate(data?.["discount to"]));
			}
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		let submittable = true;

		let priceRegex = new RegExp("^(200(\\.0{1,2})?|([1-9]?[0-9]|1[0-9]{2})(\\.[0-9]{1,2})?)$"); // regex kiểm tra giá của khóa học nằm trong khoảng [1,200]
		let discountRegex = new RegExp("^(1(\\.0{1,2})?|0(\\.[0-9]{1,2})?)$");
		// check gia
		if (!priceRegex.test(price)) {
			setValidInputs((prev) => ({
				...prev,
				price: { isValid: false, errMsg: "Price course is between 1.00 and 200.00 USD" },
			}));
			submittable = false;
		} else {
			setValidInputs((prev) => ({
				...prev,
				price: { isValid: true, errMsg: "" },
			}));
		}
		// check discount
		if (!discountRegex.test(discount.toString())) {
			setValidInputs((prev) => ({
				...prev,
				discount: { isValid: false, errMsg: "Discount course is between 0.00 and 1.00 USD" },
			}));
			submittable = false;
		} else {
			setValidInputs((prev) => ({
				...prev,
				discount: { isValid: true, errMsg: "" },
			}));
		}
		// check ngay
		if (endDate && startDate) {
			if (endDate < startDate) {
				setValidInputs((prev) => ({
					...prev,
					endDate: { isValid: false, errMsg: "End date must be later than start date" },
				}));
				submittable = false;
			} else {
				setValidInputs((prev) => ({
					...prev,
					endDate: { isValid: true, errMsg: "" },
				}));
			}
		}

		if (submittable) {
			updatePriceCourseMutation.mutate({
				courseId: params?.courseId,
				newPrice: price || 0,
				newDiscount: discount || 0,
				discountFrom: startDate ? `${startDate.year}/${startDate.month}/${startDate.day}` : null,
				discountTo: endDate ? `${endDate.year}/${endDate.month}/${endDate.day}` : null,
				currency: "USD",
			});
		}
	};

	return (
		<div className=" py-12 bg-gray-100 min-h-screen">
			<form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg max-w-4xl mx-auto shadow-lg">
				{/* Tabs and Switch */}
				<div className="flex justify-between items-center border-b border-gray-300 mb-6 pb-4">
					<div className="flex space-x-8">
						<button
							type="button"
							onClick={() => setActiveTab("price")}
							className={`text-lg font-semibold flex ${
								activeTab === "price" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"
							}`}>
							<AiFillCrown className="text-2xl mr-2" />
							<span>Set Price</span>
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("revenue")}
							className={`text-lg font-semibold ${
								activeTab === "revenue"
									? "text-orange-500 border-b-2 border-orange-500"
									: "text-gray-500"
							}`}>
							Revenue
						</button>
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							className="sr-only"
							checked={isSettingsVisible}
							onChange={handleUnCheck}
						/>
						<div className="w-12 h-6 bg-gray-300 rounded-full peer-focus:ring-2 peer-focus:ring-green-500 transition-all relative">
							<div
								className={`absolute top-0.5 left-1 h-5 w-5 rounded-full transition-all duration-200 ${
									isSettingsVisible ? "bg-green-500 transform translate-x-6" : "bg-white"
								}`}></div>
						</div>
					</label>
				</div>

				{activeTab === "price" ? (
					isSettingsVisible && (
						<div className="bg-white p-8 rounded-md shadow-md">
							<h2 className="text-2xl font-semibold mb-6">Set Course's price</h2>

							{/* Price and Duration */}
							<div className="flex gap-6 mb-6">
								<div className="w-1/2">
									<label className="block font-medium text-gray-600 mb-2">Price ($) </label>
									<Input
										color="primary"
										type="number"
										value={price}
										step={0.01}
										onValueChange={setPrice}
										placeholder="$ 0.00"
										variant="bordered"
										size="lg"
										radius="sm"
										endContent={<span>$</span>}
										isInvalid={!validInputs.price.isValid}
										errorMessage={validInputs.price.errMsg}
									/>
								</div>
							</div>

							{/* Discount Settings */}
							<div className="mb-6">
								<input
									type="checkbox"
									checked={isDiscountEnabled}
									onChange={() => {
										if (!isDiscountEnabled && price <= 0) {
											toast.warn("set-price");
										} else {
											setIsDiscountEnabled(!isDiscountEnabled);
										}
									}}
									className="mr-2"
								/>
								<label className="font-medium text-gray-600">Set Course's discount</label>
							</div>

							{isDiscountEnabled && (
								<div className="flex gap-6 mb-6">
									{/* Discount Percentage */}
									<div className="w-1/3">
										<label className="block font-medium text-gray-600 mb-2">Discount (%)</label>
										<Input
											type="number"
											step={0.01}
											value={discount}
											onValueChange={setDiscount}
											placeholder="%0.00"
											size="lg"
											variant="bordered"
											radius="sm"
											isInvalid={!validInputs.discount.isValid}
											errorMessage={validInputs.discount.errMsg}
										/>
									</div>

									{/* Start Date */}
									<div className="w-1/3 relative">
										<label className="block font-medium text-gray-600 mb-2">From Date (UTC)</label>
										<DatePicker
											granularity="day"
											size="lg"
											variant="bordered"
											radius="sm"
											aria-label="start date"
											value={startDate}
											onChange={setStartDate}
										/>
									</div>

									{/* End Date */}
									<div className="w-1/3 relative">
										<label className="block font-medium text-gray-600 mb-2">To Date (UTC)</label>
										<DatePicker
											granularity="day"
											size="lg"
											variant="bordered"
											radius="sm"
											isInvalid={!validInputs.endDate.isValid}
											errorMessage={validInputs.endDate.errMsg}
											value={endDate}
											aria-label="end date"
											onChange={setEndDate}
										/>
									</div>
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex gap-4 justify-end">
								<Button type="reset" color="default" size="lg" radius="sm">
									Cancel
								</Button>
								<Button
									isLoading={updatePriceCourseMutation.isPending}
									type="submit"
									color="secondary"
									size="lg"
									radius="sm">
									Update
								</Button>
							</div>
						</div>
					)
				) : (
					<Revenue courseId={params?.courseId} price={price} />
				)}
			</form>
		</div>
	);
};

export default CourseBusiness;
