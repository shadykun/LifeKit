import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import LoadingView from '../components/LoadingView';
import useNearbyPlaces from '../hooks/useNearbyPlaces';

// react-native-maps has no web implementation, so the web build lists the places instead.
export default function MapScreen() {
  const { places, loading } = useNearbyPlaces();

  if (loading) {
    return <LoadingView message="Se caută date..." />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.warningBox}>
        <Text style={styles.warningTitle}>Modul Web Limitat</Text>
        <Text style={styles.warningText}>
          Harta interactivă este disponibilă doar în aplicația mobilă.
          Mai jos este lista locațiilor găsite:
        </Text>
      </View>

      {places.map((place, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.placeName}>{place.name}</Text>
          <Text style={styles.placeAddress}>{place.address}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F5F7FA', minHeight: '100%' },
  warningBox: { backgroundColor: '#FFF3E0', padding: 15, borderRadius: 10, marginBottom: 20, borderLeftWidth: 5, borderLeftColor: '#FF9800' },
  warningTitle: { fontWeight: 'bold', color: '#E65100', marginBottom: 5 },
  warningText: { color: '#555', fontSize: 14 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  placeName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  placeAddress: { color: '#666', marginTop: 4 },
});
