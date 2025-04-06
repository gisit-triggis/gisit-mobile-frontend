import axiosInstance from '../../api/api.interceptor';
import {IRouteRequest, IRouteResponse} from '../../interfaces/Route';

export const RouteService = {
  async postRoute(data: IRouteRequest): Promise<IRouteResponse> {
    const geojsonStr = encodeURIComponent(
      JSON.stringify(data.geojson_geometry),
    );

    console.log(data.geojson_geometry);

    const url = `/user/routes/get?geojson_geometry=${JSON.stringify(
      data.geojson_geometry,
    )}&start_point_lon_lat[]=${data.start_point_lon_lat[0].toString()}&start_point_lon_lat[]=${data.start_point_lon_lat[1].toString()}&end_point_lon_lat[]=${data.end_point_lon_lat[0].toString()}&end_point_lon_lat[]=${data.end_point_lon_lat[1].toString()}`;

    console.log(url);

    const response = await axiosInstance({
      url: url,
      method: 'POST',
    });

    return response.data;
  },
};
