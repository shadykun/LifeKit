import { useEffect, useState } from 'react';

import { DEFAULT_LOCATION, NEARBY_RADIUS_METERS } from '../config';
import { ApiService } from '../services/api';

// Loads the first-aid centers around DEFAULT_LOCATION once, on mount.
export default function useNearbyPlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ApiService.getNearbyFirstAidCenters({ ...DEFAULT_LOCATION, radius: NEARBY_RADIUS_METERS })
      .then((json) => setPlaces(json.places || json))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { places, loading, error };
}
