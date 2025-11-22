import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ModuleDetailScreen({ navigation, route }) {
  // Primim datele modulului din ecranul anterior (ModulesScreen)
  // Dacă nu există date (ex: testing), folosim un fallback
  const { moduleData } = route.params || { 
    moduleData: { title: 'Modul Test', color: '#666', icon: 'help', id: 'test' } 
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{padding: 20}}>
        
        {/* Header Vizual */}
        <View style={[styles.headerBanner, { backgroundColor: moduleData.color }]}>
          <Ionicons name={moduleData.icon} size={60} color="#fff" />
          <Text style={styles.headerTitle}>{moduleData.title}</Text>
        </View>

        {/* BUTONUL PENTRU SIMULARE (SCENARIU) */}
        <Text style={styles.sectionTitle}>Activitate Recomandată</Text>
        
        <TouchableOpacity 
          style={styles.simulationCard} 
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Scenario')} // Navighează spre ScenarioScreen
        >
           <View style={styles.simBadge}><Text style={styles.simBadgeText}>INTERACTIV</Text></View>
           <Ionicons name="game-controller" size={40} color="#fff" style={{marginBottom: 10}}/>
           <Text style={styles.simTitle}>Simulare Caz Real</Text>
           <Text style={styles.simDesc}>
             Ești pus într-o situație de urgență. Iei decizii contra cronometru. Poți salva victima?
           </Text>
           <View style={styles.playBtn}>
             <Text style={{color: '#333', fontWeight: 'bold'}}>ÎNCEPE ACUM</Text>
           </View>
        </TouchableOpacity>

        {/* Butoane secundare (Placeholders pentru colegul tău) */}
        <Text style={[styles.sectionTitle, {marginTop: 30}]}>Alte activități</Text>
        
        <TouchableOpacity 
           style={styles.actionBtn} 
           onPress={() => navigation.navigate('Flashcards')}
        >
          <Ionicons name="albums" size={24} color="#FF9800" style={{marginRight: 15}}/>
          <Text style={styles.btnTitle}>Flashcards (Memorare)</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity 
           style={styles.actionBtn}
           onPress={() => navigation.navigate('Quiz')}
        >
          <Ionicons name="checkbox" size={24} color="#4CAF50" style={{marginRight: 15}}/>
          <Text style={styles.btnTitle}>Quiz (Verificare)</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  headerBanner: { padding: 30, borderRadius: 20, alignItems: 'center', marginBottom: 25, elevation: 4 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 10, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, marginLeft: 5 },
  
  simulationCard: { backgroundColor: '#212121', padding: 25, borderRadius: 20, alignItems: 'center', position: 'relative', overflow: 'hidden', elevation: 6 },
  simBadge: { position: 'absolute', top: 15, right: 15, backgroundColor: '#FF4B4B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  simBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  simTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  simDesc: { color: '#ccc', textAlign: 'center', fontSize: 13, marginBottom: 20, lineHeight: 20 },
  playBtn: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },

  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 16, marginBottom: 10, elevation: 2 },
  btnTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
});