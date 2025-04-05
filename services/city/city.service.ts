import AsyncStorage from "@react-native-async-storage/async-storage";
import { ICitySearchResponse } from "../../interfaces/city";
import axiosInstance from "../../api/api.interceptor";

export const CityService = {
  async searchCity(query: string): Promise<ICitySearchResponse> {
    const cacheKey = `citySearch_${query}`;
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error('Ошибка при чтении кэша', e);
    }

    const response = await axiosInstance({
      url: `/user/search/city?query=${encodeURIComponent(query)}`,
      method: 'GET',
    });

    try {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(response.data));
    } catch (e) {
      console.error('Ошибка сохранения кэша', e);
    }
    return response.data;
  },
};
