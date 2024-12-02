import React, { useContext, useEffect, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Button } from "@nextui-org/react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { GlobalStateContext } from "../providers/GlobalStateProvider.jsx";
import { toast } from "react-toastify";
import { pathname } from "../routes/index.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../react-query/query-keys.js";
import { CourseService } from "../apis/course.api.js";
import { USDollar, VNDong } from "../utils/currency.js";
import vnpayLogo from "../assets/vnp-logo.png";
import vnpayLogoHorizontal from "../assets/vnpay-horizontal-logo.png";
import { PaymentService } from "../apis/payment.api.js";
import { TranslationContext } from "../providers/TranslationProvider.jsx";
import { EnrollmentService } from "../apis/enrollment.api.js";

const initialPaypalOptions = {
	clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
	currency: "USD",
	intent: "capture",
};

function Payment() {
	const params = useParams();

	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);

	const clientQuery = useQueryClient();

	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
	const [isEnrollment, setIsEnrollment] = useState(false);

	const navigate = useNavigate();

	const handlePaymentClick = (method) => {
		setSelectedPaymentMethod(selectedPaymentMethod === method ? null : method);
	};
	// check mua khoa hoc hay chua
	useEffect(() => {
		EnrollmentService.fetchEnrollmentInfo(params?.courseId, user, updateUserState)
			.then(res => {

				if (res.data?.["enrollment id"]) {
					setIsEnrollment(true);
					toast.info("You have purchased this course before");
				} else {
					setIsEnrollment(false);
				}
			}).catch(() => {
			toast.error("Oops! Something went wrong!");
		});
	}, []);

	// get thong tin khoa hoc
	const courseInfoQuery = useQuery({
		queryKey: [queryKeys.courseInfo, params?.courseId],
		queryFn: async ({ queryKey }) => {
			try {
				return await CourseService.fetchCourseInformation(queryKey[1]);
			} catch (error) {
				console.error(error);
			}
		},
		initialData: clientQuery.getQueryData([queryKeys.courseInfo, params?.courseId]),
		enabled: !clientQuery.getQueryData([queryKeys.courseInfo, params?.courseId]),
	});

	// get price
	const coursePriceQuery = useQuery({
		queryKey: [queryKeys.coursePrice, params?.courseId],
		queryFn: async () => await CourseService.fetchCoursePrices(params?.courseId),
		initialData: clientQuery.getQueryData([queryKeys.coursePrice, params?.courseId]),
		enabled: !clientQuery.getQueryData([queryKeys.coursePrice, params?.courseId]),
	});

	const onPaypalCreateOrder = async () => {
		try {
			const data = await PaymentService.createOrderPaypal({
				courseId: params?.courseId,
				intent: initialPaypalOptions.intent,
				currentCode: initialPaypalOptions.currency,
			}, user, updateUserState);
			return data?.id;
		} catch (error) {
			toast.warn(translation(error.response.data?.["errorCode"]));
		}
	};

	const fetchUrlVnPay = async () => {
		const data = await PaymentService.createUrlVnPay({
			paymentContent: `Thanh toán khóa học ${courseInfoQuery.data?.["name"]}`,
			courseId: params?.courseId,
		}, user, updateUserState);
		let heightWindow = 600, widthWindow = 800;
		let windowPosition = [(screen.width - widthWindow) / 2, (screen.height - heightWindow) / 2];
		const newWindow = window.open(data?.["vnpUrl"], "_blank", `width=${widthWindow},height=${heightWindow},left=${windowPosition[0]},top=${windowPosition[1]}},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`);
		const intervalId = setInterval(async function() {
			const res = await EnrollmentService.fetchEnrollmentInfo(params?.courseId, user, updateUserState);
			if (res.data?.["enrollment id"]) {
				clearInterval(intervalId);
				setIsEnrollment(true);
			} else {
				setIsEnrollment(false);
			}

		}, 4000);
	};

	const onPaypalApproveOrder = async (data, actions) => {
		try {
			const dataRes = await PaymentService.completeOrderPaypal({
				orderId: data.orderID,
				courseId: params?.courseId,
				intent: initialPaypalOptions.intent,
			}, user, updateUserState);
			toast.success(translation(dataRes?.["messageCode"]));
			setIsEnrollment(true);
		} catch (error) {
			toast.warn(translation(error.response.data?.["errorCode"]));
		}
	};

	return (
		isEnrollment ? <Navigate to={pathname.courseInformation.split(":")[0] + params?.courseId} /> :
			<div className="flex flex-col lg:flex-row gap-8 p-8 bg-gray-100">
				{/* Left Section: Course Summary */}
				<div className="bg-white p-6 rounded-lg shadow-lg lg:w-1/2 w-full">
					<h3 className="text-xl font-semibold mb-4">1 Course</h3>

					{/* Course Items */}
					<div className="space-y-4">
						<div className="flex items-center border-b pb-4">
							<img src={courseInfoQuery.data?.["image"]} alt="Course 1"
								 className="w-16 h-16 rounded mr-4" />
							<div className="flex flex-col">
								<p className="text-gray-600">Khóa
									của <strong className="text-primary">
										{courseInfoQuery.data?.["first name"] && courseInfoQuery.data?.["last name"] ? `${courseInfoQuery.data?.["first name"]} ${courseInfoQuery.data?.["last name"]}` : courseInfoQuery.data?.["username"]}
									</strong>
								</p>
								<p className="text-gray-800 font-semibold">{courseInfoQuery.data?.["name"]}</p>
								<p className="text-gray-800 font-normal">{courseInfoQuery.data?.["short description"]}</p>
								<div className="flex items-center">
									<p className="text-orange-600 font-semibold">{coursePriceQuery.data?.["currency"] === "USD" ? USDollar.format(coursePriceQuery.data?.["price"]) : VNDong.format(coursePriceQuery.data?.["price"])}</p>
									<p className="ms-2 text-danger text-sm">-{coursePriceQuery.data?.["discount"] * 100}%</p>
								</div>
							</div>
						</div>
					</div>

					{/* Payment Summary */}
					<div className="mt-6 border-t pt-4">
						<div className="flex justify-between text-gray-600">
							<span>Tổng tiền</span>
							<span>{coursePriceQuery.data?.["currency"] === "USD" ? USDollar.format(coursePriceQuery.data?.["price"]) : VNDong.format(coursePriceQuery.data?.["price"])}</span>
						</div>
						<div className="flex justify-between text-gray-600">
							<span>Giảm giá</span>
							<span>{coursePriceQuery.data?.["currency"] === "USD" ? USDollar.format(coursePriceQuery.data?.["price"] * (coursePriceQuery.data?.["discount"])) : VNDong.format(coursePriceQuery.data?.["price"] * (coursePriceQuery.data?.["discount"]))}</span>
						</div>
						<div className="flex justify-between text-xl font-semibold mt-4">
							<span>Tổng thanh toán:</span>
							<span>{coursePriceQuery.data?.["currency"] === "USD" ? USDollar.format(coursePriceQuery.data?.["price"] * (1 - coursePriceQuery.data?.["discount"])) : VNDong.format(coursePriceQuery.data?.["price"] * (1 - coursePriceQuery.data?.["discount"]))}</span>
						</div>
						{/*<button*/}
						{/*	className="w-full bg-orange-500 text-white py-3 mt-6 rounded-lg font-semibold hover:bg-orange-600 transition">*/}
						{/*	Hoàn Tất Thanh Toán*/}
						{/*</button>*/}
					</div>
				</div>

				{/* Right Section: Payment Options */}
				<div className="bg-white p-6 rounded-lg shadow-lg lg:w-1/2 w-full">
					<h3 className="text-xl font-semibold mb-4">Phương Thức Thanh Toán</h3>

					{/* Các Phương Thức Thanh Toán */}
					<div className="flex justify-center gap-4 mb-6">
						{/* Nút PayPal */}
						<button onClick={() => handlePaymentClick("paypal")}
								className="flex flex-col items-center px-10 py-4 hover:bg-gray-100 rounded-sm transition-all">
							<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48"
								 viewBox="0 0 48 48">
								<path fill="#1565C0"
									  d="M18.7,13.767l0.005,0.002C18.809,13.326,19.187,13,19.66,13h13.472c0.017,0,0.034-0.007,0.051-0.006C32.896,8.215,28.887,6,25.35,6H11.878c-0.474,0-0.852,0.335-0.955,0.777l-0.005-0.002L5.029,33.813l0.013,0.001c-0.014,0.064-0.039,0.125-0.039,0.194c0,0.553,0.447,0.991,1,0.991h8.071L18.7,13.767z"></path>
								<path fill="#039BE5"
									  d="M33.183,12.994c0.053,0.876-0.005,1.829-0.229,2.882c-1.281,5.995-5.912,9.115-11.635,9.115c0,0-3.47,0-4.313,0c-0.521,0-0.767,0.306-0.88,0.54l-1.74,8.049l-0.305,1.429h-0.006l-1.263,5.796l0.013,0.001c-0.014,0.064-0.039,0.125-0.039,0.194c0,0.553,0.447,1,1,1h7.333l0.013-0.01c0.472-0.007,0.847-0.344,0.945-0.788l0.018-0.015l1.812-8.416c0,0,0.126-0.803,0.97-0.803s4.178,0,4.178,0c5.723,0,10.401-3.106,11.683-9.102C42.18,16.106,37.358,13.019,33.183,12.994z"></path>
								<path fill="#283593"
									  d="M19.66,13c-0.474,0-0.852,0.326-0.955,0.769L18.7,13.767l-2.575,11.765c0.113-0.234,0.359-0.54,0.88-0.54c0.844,0,4.235,0,4.235,0c5.723,0,10.432-3.12,11.713-9.115c0.225-1.053,0.282-2.006,0.229-2.882C33.166,12.993,33.148,13,33.132,13H19.66z"></path>
							</svg>
							<span className="text-sm mt-2">PayPal</span>
						</button>

						{/* Nút VNPay */}
						<button onClick={() => handlePaymentClick("vnpay")}
								className="flex flex-col items-center px-10 py-4 hover:bg-gray-100 rounded-sm transition-all">
							<img src={vnpayLogo} alt="VNPAY" className="w-12 cursor-pointer" />
							<span className="text-sm mt-2">VNPay</span>
						</button>

						{/*/!* Nút QR Code VNPay *!/*/}
						{/*<button onClick={() => handlePaymentClick('vnpay-qr')} className="flex flex-col items-center">*/}
						{/*  <img src="/assets/vnpayqrlogo.png" alt="VNPAYQR Code" className="w-12 cursor-pointer" />*/}
						{/*  <span className="text-sm mt-2">VNPay QR</span>*/}
						{/*</button>*/}
					</div>

					{/* Phần Thông Tin Phương Thức Thanh Toán */}
					<div
						className={`overflow-hidden transition-all duration-300 ease-in-out ${selectedPaymentMethod ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
						{selectedPaymentMethod === "paypal" && (
							<div className="px-4 border-t border-gray-300">
								<p className="text-gray-600">Thanh toán bằng PayPal</p>
								<PayPalScriptProvider deferLoading={false} options={initialPaypalOptions}>
									<PayPalButtons style={{ layout: "vertical" }}
												   createOrder={onPaypalCreateOrder}
												   onApprove={onPaypalApproveOrder} />
								</PayPalScriptProvider>
							</div>
						)}
						{selectedPaymentMethod === "vnpay" && (
							<div className="p-4 border-t border-gray-300">
								<p className="text-gray-600">Thanh toán bằng VNPay</p>
								<Button size="lg" className="w-full mt-8 rounded-sm" onClick={fetchUrlVnPay}>
									Thanh toán ngay với
									<img className="h-[80%]" src={vnpayLogoHorizontal} alt="vnpay" />
								</Button>
							</div>
						)}

					</div>
				</div>
			</div>

	);
}

export default Payment;
