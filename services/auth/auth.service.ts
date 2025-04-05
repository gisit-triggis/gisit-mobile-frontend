import AsyncStorage from "@react-native-async-storage/async-storage"
import axiosInstance from "@/api/api.interceptor"
import {
	ILoginRequest,
	ILoginResponse,
	IRegisterRequest,
	IRegisterResponse,
} from "@/interfaces/auth"
import {
	IProfileChange,
	IProfileChangeResponse,
	IProfileResponse,
} from "@/interfaces/user"

export const AuthService = {
	async login(data: ILoginRequest): Promise<ILoginResponse> {
		const response = await axiosInstance({
			url: "/auth/login",
			method: "POST",
			data,
		})

		const token = response.data?.data?.token
		if (token) {
			await AsyncStorage.setItem("sso", token)
		}

		return response.data
	},

	async register(data: IRegisterRequest): Promise<IRegisterResponse> {
		const response = await axiosInstance({
			url: "/auth/register",
			method: "POST",
			data,
		})

		const token = response.data?.data?.token
		console.log(response.data, token)
		if (token) {
			await AsyncStorage.setItem("sso", token)
		}

		return response.data
	},

	async changeProfile(data: IProfileChange): Promise<IProfileChangeResponse> {
		const response = await axiosInstance({
			url: "/user/me",
			method: "PATCH",
			data,
		})

		return response.data
	},

	async logout(): Promise<void> {
		await AsyncStorage.removeItem("sso")
	},

	async getProfile(): Promise<IProfileResponse> {
		const response = await axiosInstance({
			url: "/user/me",
			method: "GET",
		})

		return response.data
	},
}
