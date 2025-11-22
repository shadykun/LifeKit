import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Platform 
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ModuleDetailScreen({ navigation, route }) {
  const { moduleData } = route.params || { 
    moduleData: { id: 'test', title: 'Curs Test', color: '#666', icon: 'book' } 
  };

  // Pasează ID-ul cursului către activități
  const navigateToActivity = (screenName) => {
    navigation.navigate(screenName, { 
      moduleId: moduleData.id, 
      moduleTitle: moduleData.title 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      <View style={styles.webWrapper}>
        <ScrollView contentContainerStyle={{padding: 20, paddingBottom: 40}}>
          
          <View style={[styles.headerBanner, { backgroundColor: moduleData.color || '#666' }]}>
            <Ionicons name={moduleData.icon || 'book'} size={60} color="#fff" />
            <Text style={styles.headerTitle}>{moduleData.title}</Text>
            <Text style={styles.headerDesc}>{moduleData.description || "Descriere curs."}</Text>
          </View>

          <Text style={styles.sectionTitle}>Începe Cursul</Text>
          
          <TouchableOpacity style={styles.simulationCard} onPress={() => navigateToActivity('Scenario')}>
             <View style={styles.simBadge}><Text style={styles.simBadgeText}>RECOMANDAT</Text></View>
             <Ionicons name="school" size={40} color="#fff" style={{marginBottom: 10}}/>
             <Text style={styles.simTitle}>Alege Modul de Învățare</Text>
             <Text style={styles.simDesc}>Scenariu interactiv pas-cu-pas sau video.</Text>
             <View style={styles.playBtn}><Text style={{color: '#333', fontWeight: 'bold'}}>START CURS</Text></View>
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, {marginTop: 30}]}>Exersare</Text>
          
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigateToActivity('Flashcards')}>
            <View style={[styles.iconBox, {backgroundColor: '#FFF3E0'}]}><Ionicons name="albums" size={24} color="#FF9800"/></View>
            <View style={{flex: 1}}>
              <Text style={styles.btnTitle}>Flashcards</Text>
              <Text style={styles.btnSub}>Memorare termeni</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => navigateToActivity('Quiz')}>
            <View style={[styles.iconBox, {backgroundColor: '#E8F5E9'}]}><Ionicons name="checkbox" size={24} color="#4CAF50"/></View>
            <View style={{flex: 1}}>
              <Text style={styles.btnTitle}>Quiz Final</Text>
              <Text style={styles.btnSub}>Verificare cunoștințe</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  webWrapper: { flex: 1, alignSelf: 'center', width: '100%', maxWidth: 600, backgroundColor: Platform.OS === 'web' ? '#fff' : 'transparent' },
  headerBanner: { padding: 30, borderRadius: 20, alignItems: 'center', marginBottom: 25, elevation: 4, shadowOpacity: 0.2, shadowOffset: {width:0,height:2} },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 10, textAlign: 'center' },
  headerDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 5, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, marginLeft: 5 },
  simulationCard: { backgroundColor: '#212121', padding: 25, borderRadius: 20, alignItems: 'center', position: 'relative', overflow: 'hidden', elevation: 6, ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}) },
  simBadge: { position: 'absolute', top: 15, right: 15, backgroundColor: '#FF4B4B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  simBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  simTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  simDesc: { color: '#ccc', textAlign: 'center', fontSize: 13, marginBottom: 20, lineHeight: 20 },
  playBtn: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 16, marginBottom: 12, elevation: 2, ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}) },
  iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  btnTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  btnSub: { fontSize: 12, color: '#888', marginTop: 2 },
});