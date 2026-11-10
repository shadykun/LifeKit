import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';

import LoadingView from '../components/LoadingView';
import { API_BASE_URL, DEFAULT_LOCATION } from '../config';
import useNearbyPlaces from '../hooks/useNearbyPlaces';

export default function MapScreen() {
  const { places, loading, error } = useNearbyPlaces();

  useEffect(() => {
    if (error) {
      Alert.alert(
        'Eroare Conexiune',
        `Nu mă pot conecta la ${API_BASE_URL}.\n\n1. Verifica dacă IP-ul e corect.\n2. Verifica daca serverul ruleaza cu --host 0.0.0.0`
      );
    }
  }, [error]);

  if (loading) {
    return <LoadingView message="Se caută locații pe rețea..." />;
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{ ...DEFAULT_LOCATION, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
      showsUserLocation
    >
      <Marker coordinate={DEFAULT_LOCATION} pinColor="blue" title="Locația ta (Centru Cluj)" />

      {places.map((place, idx) => (
        <Marker
          key={idx}
          coordinate={{ latitude: parseFloat(place.lat), longitude: parseFloat(place.lon) }}
          pinColor="red"
          title={place.name}
          description={place.address}
        >
          <Callout>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutTitle}>{place.name}</Text>
              <Text>{place.address}</Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  calloutContainer: { width: 200, padding: 5 },
  calloutTitle: { fontWeight: 'bold', marginBottom: 5 },
});
