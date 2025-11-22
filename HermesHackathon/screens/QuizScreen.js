import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Acest fișier este doar un placeholder ca să nu crape aplicația
// Colegul tău va suprascrie acest cod pe branch-ul lui.

export default function QuizScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="construct" size={60} color="#ccc" />
      <Text style={styles.text}>Zona Quiz</Text>
      <Text style={styles.subText}>Colegul lucrează aici...</Text>
      <Text style={styles.subText}>Tu testează Scenariile!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  }
});