import axiosInstance from '../../api/api.interceptor';
import {IMarkResponse} from '../../interfaces/mark';

export const MarkService = {
  async getAll(): Promise<IMarkResponse> {
    const response = await axiosInstance({
      url: '/user/marks/list',
      method: 'GET',
    });

    return response.data;
  },

  async getMy(): Promise<IMarkResponse> {
    const response = await axiosInstance({
      url: '/user/marks/me',
      method: 'GET',
    });

    return response.data;
  },
};
