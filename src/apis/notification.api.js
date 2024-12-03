import { createHttpAuth } from "../config/http.js";

class NotificationServiceClass {
	async getNotification(notificationId, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.get(`/notification/get?notification-id=${notificationId}`);
		return res.data;
	}

	async getAllNotifications(userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.get(`/notification/get-all`);
		return res.data;
	}
}

const NotificationService = new NotificationServiceClass();
export { NotificationService };