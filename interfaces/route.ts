export interface IRouteRequest {
  geojson_geometry: any;
  start_point_lon_lat: number[];
  end_point_lon_lat: number[];
}

export interface IRouteResponse {
  message: string;
  data: {
    image: string;
    routes: any;
    costs: any;
    status: string;
  };
}
