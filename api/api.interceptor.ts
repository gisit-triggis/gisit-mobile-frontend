import axios from "axios"
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const axiosInstance = axios.create({
	baseURL:
		process.env.API_BASE_URL || "https://api.gisit-triggis-hackathon.ru/api/v1", // URL вашего API
	headers: {
		"Content-Type": "application/json",
	},
})

// Интерцептор запроса: получаем токен из AsyncStorage и добавляем в заголовок Authorization
axiosInstance.interceptors.request.use(
	async (config) => {
		try {
			const token = await AsyncStorage.getItem("sso")
			if (token && config.headers) {
				config.headers["Authorization"] = `Bearer ${token}`
			}
		} catch (error) {
			console.error("Ошибка получения токена из AsyncStorage:", error)
		}
		return config
	},
	(error: AxiosError) => Promise.reject(error)
)

// Интерцептор ответа: обработка ошибок, например, 401
axiosInstance.interceptors.response.use(
	(response: AxiosResponse): AxiosResponse => response,
	async (error: AxiosError) => {
		if (error.response && error.response.status === 401) {
			console.warn("Неавторизованный запрос, очищаем токен")
			try {
				await AsyncStorage.removeItem("sso")
				// Здесь можно добавить дополнительную логику, например, навигацию на страницу логина
			} catch (removeError) {
				console.error("Ошибка удаления токена из AsyncStorage:", removeError)
			}
		}
		return Promise.reject(error)
	}
)

export default axiosInstance
