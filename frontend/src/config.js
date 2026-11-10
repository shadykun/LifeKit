// Override with EXPO_PUBLIC_API_URL (e.g. in .env) to point the app at a local backend.
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  'http://ec2-63-178-67-11.eu-central-1.compute.amazonaws.com:8000';

// Cluj-Napoca city centre: the fixed reference point used by the map.
export const DEFAULT_LOCATION = { latitude: 46.770439, longitude: 23.591423 };
export const NEARBY_RADIUS_METERS = 5000;
