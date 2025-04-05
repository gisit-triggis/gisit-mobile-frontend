import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  IAvaChangeRequest,
  IAvaChangeResponse,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse,
} from '../../interfaces/auth';
import axiosInstance from '../../api/api.interceptor';
import {
  IProfileChange,
  IProfileChangeResponse,
  IProfilePhotoResponse,
  IProfileResponse,
} from '../../interfaces/user';

export const AuthService = {
  async login(data: ILoginRequest): Promise<ILoginResponse> {
    const response = await axiosInstance({
      url: '/auth/login',
      method: 'POST',
      data,
    });

    const token = response.data?.data?.token;
    if (token) {
      await AsyncStorage.setItem('sso', token);
    }

    return response.data;
  },

  async register(data: IRegisterRequest): Promise<IRegisterResponse> {
    const response = await axiosInstance({
      url: '/auth/register',
      method: 'POST',
      data,
    });

    const token = response.data?.data?.token;
    console.log(response.data, token);
    if (token) {
      await AsyncStorage.setItem('sso', token);
    }

    return response.data;
  },

  async changeProfile(data: IProfileChange): Promise<IProfileChangeResponse> {
    const response = await axiosInstance({
      url: '/user/me',
      method: 'PATCH',
      data,
    });

    return response.data;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('sso');
  },

  async getProfile(): Promise<IProfileResponse> {
    const response = await axiosInstance({
      url: '/user/me',
      method: 'GET',
    });

    return response.data;
  },

  // Метод для загрузки фото, исправлено название поля с "avatar" на "file"
  async uploadProfilePhoto(photoUri: string): Promise<IProfilePhotoResponse> {
    const formData = new FormData();

    formData.append('file', {
      uri: photoUri,
      type: 'image/jpeg', // Если нужно, можно менять на image/png
      name: 'avatar.jpg',
    } as any);

    const response = await axiosInstance({
      url: '/user/storage', // Убедитесь, что это правильный эндпоинт
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async changeAva(data: IAvaChangeRequest): Promise<IAvaChangeResponse> {
    const response = await axiosInstance({
      url: '/user/storage',
      method: 'POST',
      data,
    });

    return response.data;
  },

  async searchCity(query: string): Promise<any> {
    const response = await axiosInstance({
      url: `/user/search/city?query=${encodeURIComponent(query)}`,
      method: 'GET',
    });
    return response.data;
  },
};
