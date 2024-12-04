import { createHttpAuth, http } from "../config/http";
import { toast } from "react-toastify";


class CourseServiceClass {
	async createCourse(userState, updateUserState, payload) {
		const {
			courseName,
			sourceLanguageId,
			courseLevelId,
			tag,
			shortDescription,
			detailedDescription,
			image,
		} = payload;


		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post(`/course/create`, {
			courseName,
			sourceLanguageId,
			courseLevelId,
			tag,
			shortDescription,
			detailedDescription,
			image,
		});
		return res.data;
	}

	async updateCourseInformation(payload, user, updateUserState) {
		const {
			courseId,
			courseName,
			sourceLanguageId,
			courseLevelId,
			tag,
			shortDescription,
			detailedDescription,
			image,
			isPrivate = 0,
		} = payload;
		const httpAuth = createHttpAuth(user, updateUserState);
		const response = await httpAuth.post(`/course/update`, {
			courseId,
			courseName,
			sourceLanguageId,
			courseLevelId,
			tag,
			shortDescription,
			detailedDescription,
			image,
			isPrivate,
		});
		return response.data;
	}


	async fetchCourseInformation(courseId) {
		const res = await http.get(`/course/overview?course-id=${courseId}`);
		return res.data;
	}

	async fetchCourseContent(courseId) {
		const res = await http.get(`/course/content?course-id=${courseId}`);
		return res.data;
	}

	async fetchCourseComment(courseId) {
		const res = await http.get(`/course/comment?course-id=${courseId}`);
		return res.data;
	}

	async fetchCourseLanguages(courseId) {
		const res = await http.get(`/course/languages?course-id=${courseId}`);
		return res.data;
	}

	async addNewLevelCourse(courseId, levelName, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post(`/level/new`, { courseId: Number(courseId), levelName: levelName });
		return res.data;
	}

	async removeLevelCourse(courseId, levelId, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.delete(`/level/delete?course-id=${courseId}&level-id=${levelId}`);
		return res.data;
	}

	async updateLevelNameCourse(courseId, levelId, levelName, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post("/level/edit", {
			courseId: Number(courseId),
			levelId: Number(levelId),
			levelName,
		});
		return res.data;
	}

	async fetchCoursePrices(courseId) {
		try {
		  console.log("Fetching course prices for courseId:", courseId);
		  const res = await http.get(`/course/prices?course-id=${courseId}`);
		  return res.data;
		} catch (error) {
		  console.error("Error fetching course prices:", error);
		  if (error.response) {
			toast.error(`Error: ${error.response.data?.message || "Something went wrong!"}`);
			return error.response.data;
		  } else if (error.request) {
			toast.error("Error: No response from server!");
		  } else {
			toast.error(`Error: ${error.message}`);
		  }
		  return {};
		}
	  }
	  
	
	async searchCourses(params) {
		try {
			const res = await http.get(`/course/search-course`, { params });
			return res.data;
		} catch (error) {
			toast.error("Error fetching search results");
			console.error("Error in searchCourses:", error);
			return { courses: [] }; 
		}
	}


	async updateCoursePrice(payload, userState, updateState) {
		const {
			courseId,
			newPrice,
			newDiscount,
			discountFrom = null,
			discountTo = null,
			currency,
		} = payload;
		const httpAuth = createHttpAuth(userState, updateState);
		const res = await httpAuth.post("/course/price-update", {
			courseId,
			newPrice,
			newDiscount,
			discountFrom,
			discountTo,
			currency,
		});
		return res.data;
	}

	
}



const CourseService = new CourseServiceClass();

export { CourseService };
