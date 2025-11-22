import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function FlashcardsScreen() {
  return (
    <View style={styles.container}>
      {/* Un card static placeholder */}
      <View style={styles.cardPlaceholder}>
        <Ionicons name="hammer-outline" size={50} color="#FF9800" />
        <Text style={styles.cardTitle}>Zona Flashcards</Text>
        <Text style={styles.cardText}>
          Colegul tău construiește logica de "Flip" aici.
        </Text>
      </View>

      <Text style={styles.infoText}>
        Poți naviga înapoi și testa Scenariile.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardPlaceholder: {
    width: 300,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 30,
    // Efect de umbră (Shadow)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Pentru Android
    borderWidth: 1,
    borderColor: '#eee'
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic'
  }
});