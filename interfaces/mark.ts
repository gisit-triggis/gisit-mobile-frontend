export interface IGeometry {
  type: string; // Например, "Point"
  coordinates: number[]; // [longitude, latitude]
}

export interface IMark {
  id: string;
  created_at: string;
  updated_at: string;
  type: string; // например, "warning"
  description: string;
  geometry: IGeometry;
  user_id: string;
}

export interface IMarkResponse {
  message: string;
  data: IMark[];
}
