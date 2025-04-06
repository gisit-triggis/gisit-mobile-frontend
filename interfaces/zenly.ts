// {
//     "type": "position_update",
//     "user_id": "01jr0gkwrx5yytr7cpfv33azxz",
//     "lat": 62.02582646028779,
//     "lon": 129.72226788746684,
//     "speed": 0,
//     "status": "ACTIVE",
//     "timestamp": "2025-04-06T02:57:44+00:00"
// }

export interface IZenlyUpdate {
  type: string;
  user_id: string;
  lat: number;
  lon: number;
  speed: number;
  status: string;
  timestamp: string;
}

export interface IZenlyInit {
  type: string;
  positions: IZenlyUpdate[];
}
