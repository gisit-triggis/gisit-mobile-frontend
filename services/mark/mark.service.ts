import axiosInstance from '../../api/api.interceptor';
import {IMarkCreateRequest, IMarkResponse} from '../../interfaces/mark';

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

  async create(data: IMarkCreateRequest) {
    const response = await axiosInstance({
      url: '/user/marks/create',
      method: 'POST',
      data,
    });

    return response.data;
  },

  async delete(id: string) {
    const response = await axiosInstance({
      url: `/user/marks/delete?id=${id}`,
      method: 'POST',
    });

    return response.data;
  },
};
