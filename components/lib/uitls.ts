export function formatIsoDate(isoString: string): string {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export type Coordinate = [number, number]; // [longitude, latitude]

export function getBoundingPolygon(
  pointA: Coordinate,
  pointB: Coordinate,
): GeoJSON.FeatureCollection {
  const [lon1, lat1] = pointA;
  const [lon2, lat2] = pointB;

  const latMin = Math.min(lat1, lat2);
  const latMax = Math.max(lat1, lat2);
  const lonMin = Math.min(lon1, lon2);
  const lonMax = Math.max(lon1, lon2);

  const latBuffer = (latMax - latMin) * 0.05;
  const lonBuffer = (lonMax - lonMin) * 0.05;

  const latMinBuffered = latMin - latBuffer;
  const latMaxBuffered = latMax + latBuffer;
  const lonMinBuffered = lonMin - lonBuffer;
  const lonMaxBuffered = lonMax + lonBuffer;

  const coordinates: Coordinate[] = [
    [lonMinBuffered, latMinBuffered],
    [lonMaxBuffered, latMinBuffered],
    [lonMaxBuffered, latMaxBuffered],
    [lonMinBuffered, latMaxBuffered],
    [lonMinBuffered, latMinBuffered], // закрываем полигон
  ];

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
      },
    ],
  };
}
