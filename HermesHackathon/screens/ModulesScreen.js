import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  TouchableOpacity,
  StatusBar
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Date simulate (Mock Data) pentru module
const MODULES_DATA = [
  {
    id: '1',
    title: 'Siguranța Salvatorului',
    description: 'Cum să te protejezi înainte de a interveni.',
    icon: 'shield-checkmark',
    color: '#4CAF50', // Verde
    progress: 1.0 // 100%
  },
  {
    id: '2',
    title: 'Suport Vital de Bază (BLS)',
    description: 'Protocolul RCP și utilizarea defibrilatorului.',
    icon: 'pulse',
    color: '#FF4B4B', // Roșu
    progress: 0.6 // 60%
  },
  {
    id: '3',
    title: 'Hemoragii și Șoc',
    description: 'Oprirea sângerărilor masive și recunoașterea șocului.',
    icon: 'bandage',
    color: '#FF9800', // Portocaliu
    progress: 0.1 // 10%
  },
  {
    id: '4',
    title: 'Obstrucția Căilor Aeriene',
    description: 'Manevra Heimlich pentru adulți și copii.',
    icon: 'body',
    color: '#2196F3', // Albastru
    progress: 0.0 // 0%
  },
  {
    id: '5',
    title: 'Arsuri și Traume',
    description: 'Primul ajutor în caz de arsuri termice și chimice.',
    icon: 'flame',
    color: '#FF5722', // Rosu inchis
    progress: 0.0
  },
];

export default function ModulesScreen() {

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      // Aici vom naviga în viitor către detaliile modulului
      onPress={() => console.log('Open module:', item.id)} 
    >
      <View style={styles.cardTop}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
           <Ionicons name={item.icon} size={28} color={item.color} />
        </View>
        
        {/* Text Info */}
        <View style={styles.textContainer}>
           <Text style={styles.cardTitle}>{item.title}</Text>
           <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
        </View>

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
          <View style={styles.progressLabelRow}>
             <Text style={styles.progressText}>
               {item.progress === 0 ? 'Neînceput' : item.progress === 1 ? 'Complet' : 'În curs'}
             </Text>
             <Text style={styles.progressPercent}>{Math.round(item.progress * 100)}%</Text>
          </View>
          <View style={styles.progressBarBg}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${item.progress * 100}%`, backgroundColor: item.color }
                ]} 
              />
          </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bibliotecă Module</Text>
        <Text style={styles.headerSubtitle}>Alege un subiect pentru a începe</Text>
      </View>

      <FlatList
        data={MODULES_DATA}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  
  header: { paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  headerSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },

  listContent: { padding: 20 },
  
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconContainer: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textContainer: { flex: 1, marginRight: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#666', lineHeight: 18 },
  
  progressContainer: { borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressText: { fontSize: 12, color: '#888', fontWeight: '600' },
  progressPercent: { fontSize: 12, color: '#333', fontWeight: 'bold' },
  progressBarBg: { height: 6, backgroundColor: '#f0f0f0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 }
});