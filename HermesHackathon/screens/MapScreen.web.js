import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";

export default function MapScreen() {
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const API_URL = "http://35.159.19.52:8000"; 

  // Putem păstra logica de fetch și pe web, doar afișăm text în loc de hartă
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        // Pe web folosim un punct fix sau geolocația browserului
        const lat = 46.770439;
        const lon = 23.591423;
        
        const response = await fetch(`${API_URL}/first-aid-centers-cluj?lat=${lat}&lon=${lon}&radius=5000`);
        if (!response.ok) throw new Error("Server error");
        
        const json = await response.json();
        const data = json.places ? json.places : json;
        setPlaces(data);
      } catch (err) {
        console.error("Web Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{marginTop: 10, color: '#555'}}>Se caută date...</Text>
      </View>
    );
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

      {places.map((p, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.placeName}>{p.name}</Text>
          <Text style={styles.placeAddress}>{p.address}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F5F7FA', minHeight: '100%' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  warningBox: { backgroundColor: '#FFF3E0', padding: 15, borderRadius: 10, marginBottom: 20, borderLeftWidth: 5, borderLeftColor: '#FF9800' },
  warningTitle: { fontWeight: 'bold', color: '#E65100', marginBottom: 5 },
  warningText: { color: '#555', fontSize: 14 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  placeName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  placeAddress: { color: '#666', marginTop: 4 }
});