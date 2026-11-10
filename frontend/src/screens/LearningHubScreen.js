import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LearningHubScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Centrul de Învățare</Text>
        <Text style={styles.headerSubtitle}>Alege cum vrei să te pregătești azi</Text>
      </View>

      <View style={styles.content}>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Modules')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="book" size={32} color="#1565C0" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Teorie & Module</Text>
            <Text style={styles.cardDesc}>
              Parcurge lecțiile, quiz-urile și scenariile interactive.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Map')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="map" size={32} color="#2E7D32" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Practică & Locații</Text>
            <Text style={styles.cardDesc}>
              Găsește puncte de prim ajutor pe hartă.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { padding: 20, paddingTop: 30, marginBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  headerSubtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  content: { padding: 20 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 20, borderRadius: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, elevation: 4
  },
  iconContainer: { width: 60, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textContainer: { flex: 1, marginRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#666', lineHeight: 18 },
});
