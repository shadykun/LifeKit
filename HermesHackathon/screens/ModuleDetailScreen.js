import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar 
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; // Folosim @expo/vector-icons pentru compatibilitate Web

export default function ModuleDetailScreen({ navigation, route }) {
  // Primim datele modulului din ecranul anterior
  // Folosim un fallback sigur în caz că datele lipsesc (pentru testare izolată)
  const { moduleData } = route.params || { 
    moduleData: { 
      id: 'test', 
      title: 'Modul Test', 
      color: '#666', 
      icon: 'help-circle',
      description: 'Descriere indisponibilă.'
    } 
  };

  // Funcție helper pentru navigare cu parametri
  const navigateToActivity = (screenName) => {
    navigation.navigate(screenName, { 
      moduleId: moduleData.id,
      moduleTitle: moduleData.title 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      <ScrollView contentContainerStyle={{padding: 20, paddingBottom: 40}}>
        
        {/* --- HEADER VIZUAL --- */}
        <View style={[styles.headerBanner, { backgroundColor: moduleData.color || '#666' }]}>
          <Ionicons name={moduleData.icon || 'book'} size={60} color="#fff" />
          <Text style={styles.headerTitle}>{moduleData.title}</Text>
          {/* Opțional: Afișăm și descrierea dacă e scurtă */}
          <Text style={styles.headerDesc} numberOfLines={3}>
            {moduleData.description}
          </Text>
        </View>

        {/* --- SECȚIUNEA PRINCIPALĂ: SIMULARE --- */}
        <Text style={styles.sectionTitle}>Laborator Virtual</Text>
        
        <TouchableOpacity 
          style={styles.simulationCard} 
          activeOpacity={0.9}
          onPress={() => navigateToActivity('Scenario')} 
        >
           <View style={styles.simBadge}>
             <Text style={styles.simBadgeText}>RECOMANDAT</Text>
           </View>
           
           <Ionicons name="school" size={40} color="#fff" style={{marginBottom: 10}}/>
           
           <Text style={styles.simTitle}>Alege Modul de Învățare</Text>
           <Text style={styles.simDesc}>
             Intră în scenariul interactiv. Poți alege între modul text pas-cu-pas sau modul animat pentru copii.
           </Text>
           
           <View style={styles.playBtn}>
             <Text style={{color: '#333', fontWeight: 'bold'}}>START CURS</Text>
           </View>
        </TouchableOpacity>

        {/* --- SECȚIUNEA SECUNDARĂ: EXERSARE --- */}
        <Text style={[styles.sectionTitle, {marginTop: 30}]}>Exersare & Verificare</Text>
        
        {/* Buton Flashcards */}
        <TouchableOpacity 
           style={styles.actionBtn} 
           onPress={() => navigateToActivity('Flashcards')}
        >
          <View style={[styles.smallIconBox, {backgroundColor: '#FFF3E0'}]}>
            <Ionicons name="albums" size={24} color="#FF9800"/>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.btnTitle}>Flashcards</Text>
            <Text style={styles.btnSub}>Memorare rapidă a termenilor</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        {/* Buton Quiz */}
        <TouchableOpacity 
           style={styles.actionBtn}
           onPress={() => navigateToActivity('Quiz')}
        >
          <View style={[styles.smallIconBox, {backgroundColor: '#E8F5E9'}]}>
            <Ionicons name="checkbox" size={24} color="#4CAF50"/>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.btnTitle}>Quiz Final</Text>
            <Text style={styles.btnSub}>Verifică cunoștințele acumulate</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  
  // Header
  headerBanner: { 
    padding: 30, borderRadius: 20, alignItems: 'center', marginBottom: 25, 
    elevation: 4, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2 
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 10, textAlign: 'center' },
  headerDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 5, textAlign: 'center' },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, marginLeft: 5 },
  
  // Simulation Card
  simulationCard: { 
    backgroundColor: '#212121', padding: 25, borderRadius: 20, alignItems: 'center', 
    position: 'relative', overflow: 'hidden', elevation: 6, 
    shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3 
  },
  simBadge: { 
    position: 'absolute', top: 15, right: 15, backgroundColor: '#FF4B4B', 
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 
  },
  simBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  simTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  simDesc: { color: '#ccc', textAlign: 'center', fontSize: 13, marginBottom: 20, lineHeight: 20 },
  playBtn: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },

  // Action Buttons
  actionBtn: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    padding: 15, borderRadius: 16, marginBottom: 12, elevation: 2,
    shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05 
  },
  smallIconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  btnTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  btnSub: { fontSize: 12, color: '#888', marginTop: 2 },
});