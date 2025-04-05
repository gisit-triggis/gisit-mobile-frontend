export interface IGeometry {
  type: string; // Обычно "Point"
  coordinates: number[]; // [longitude, latitude]
}

// Интерфейс для населённого пункта
export interface ICity {
  id: string;
  created_at: string;
  updated_at: string;
  fid: number;
  title: string;
  place: string; // например, "village", "town", "hamlet"
  population: number;
  year_round_rating: number | null;
  geometry: IGeometry;
  rating: number | null;
  region_id: string;
  type: string; // обычно "Feature"
}

// Интерфейс для элемента пагинации
export interface ICitySearchLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Интерфейс для объекта данных поиска городов
export interface ICitySearchData {
  current_page: number;
  data: ICity[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: ICitySearchLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Интерфейс для всего ответа поиска городов
export interface ICitySearchResponse {
  message: string;
  data: ICitySearchData;
}
