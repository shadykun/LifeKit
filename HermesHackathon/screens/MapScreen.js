import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Alert, Text } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

export default function MapScreen() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const API_URL = `http://localhost:8000`; 

  // Locația centrului din CLUJ
  const userLocation = {
    latitude: 46.770439,
    longitude: 23.591423,
  };

  useEffect(() => {
    console.log(`Încerc să mă conectez la: ${API_URL}`);

    fetch(
      `${API_URL}/first-aid-centers-cluj?lat=${userLocation.latitude}&lon=${userLocation.longitude}&radius=5000`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        setPlaces(json.places || json); 
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare Conexiune Locală:", err);
        Alert.alert(
            "Eroare Conexiune", 
            `Nu mă pot conecta la ${API_URL}.\n\n1. Verifica dacă IP-ul e corect.\n2. Verifica daca serverul ruleaza cu --host 0.0.0.0`
        );
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{marginTop: 10, color: '#555'}}>Se caută locații pe rețea...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation={true}
    >

      <Marker
        coordinate={userLocation}
        pinColor="blue"
        title="Locația ta (Centru Cluj)"
      />

      {places.map((p, idx) => (
        <Marker
          key={idx}
          coordinate={{
            latitude: parseFloat(p.lat),
            longitude: parseFloat(p.lon),
          }}
          pinColor="red"
          title={p.name}
          description={p.address}
        >
            <Callout>
                <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{p.name}</Text>
                    <Text>{p.address}</Text>
                </View>
            </Callout>
        </Marker>
      ))}

    </MapView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  calloutContainer: {
    width: 200,
    padding: 5
  },
  calloutTitle: {
      fontWeight: 'bold',
      marginBottom: 5
  }
});