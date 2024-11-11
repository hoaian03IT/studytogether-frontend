import { createHttpAuth } from "../config/http.js";

class PaymentServiceClass {
	async createOrderPaypal(payload, userState, updateUserState) {
		const { courseId, currentCode, intent } = payload;
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post("/payment/paypal/create-order", { courseId, currentCode, intent });
		return res.data;
	}

	async completeOrderPaypal(payload, userState, updateUserState) {
		const { orderId, courseId, intent } = payload;
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post("/payment/paypal/complete-order", { courseId, intent, orderId });
		return res.data;
	}

	async createUrlVnPay(payload, userState, updateUserState) {
		const { paymentContent, courseId } = payload;
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post("/payment/vnpay/create-order", { paymentContent, courseId });
		return res.data;
	}
}

const PaymentService = new PaymentServiceClass();

export { PaymentService };