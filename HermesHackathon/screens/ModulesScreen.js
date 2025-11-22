import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ApiService } from '../services/ApiService'; 

export default function ModulesScreen({ navigation }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourses = async () => {
    try {
      // 1. Cerem datele de la server
      const data = await ApiService.getCourses();
      
      // 2. Backend-ul tău returnează list[Course], deci un Array direct.
      if (Array.isArray(data)) {
        
        // --- HARDCODING PROGRES ---
        // Adăugăm un progres fictiv fiecărui curs pentru a testa UI-ul
        const dataWithMockProgress = data.map((item, index) => ({
            ...item,
            // Generăm un număr între 0.1 și 0.9 bazat pe index (ca să fie diferit la fiecare card)
            // Exemplu: Card 1 -> 30%, Card 2 -> 60%, Card 3 -> 90% ...
            progress: ((index + 1) * 0.3) % 1 
        }));

        setModules(dataWithMockProgress);
      } else {
        console.warn("Format date neașteptat:", data);
        // Fallback
        setModules(data.courses || []);
      }
    } catch (error) {
      Alert.alert("Eroare Conexiune", "Nu am putut încărca cursurile. Verifică dacă serverul FastAPI rulează.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Încărcăm la pornire
  useEffect(() => {
    fetchCourses();
  }, []);

  // Funcție pentru "Pull to Refresh"
  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  const renderItem = ({ item }) => {
    // Valori default în caz că lipsesc din DB
    const iconName = item.icon || 'book';
    const cardColor = item.color || '#4CAF50';
    const title = item.title || item.name || 'Curs Fără Titlu';
    const desc = item.description || 'Nicio descriere disponibilă.';
    
    // Folosim progresul hardcodat sau 0
    const progressValue = item.progress || 0;

    return (
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ModuleDetail', { moduleData: { ...item, title, color: cardColor, icon: iconName } })} 
      >
        <View style={styles.cardTop}>
          <View style={[styles.iconContainer, { backgroundColor: cardColor + '20' }]}>
             <Ionicons name={iconName} size={28} color={cardColor} />
          </View>
          
          <View style={styles.textContainer}>
             <Text style={styles.cardTitle}>{title}</Text>
             <Text style={styles.cardDesc} numberOfLines={2}>{desc}</Text>
          </View>

          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </View>

        {/* Bară progres (Acum va fi vizibilă cu datele hardcodate) */}
        <View style={styles.progressContainer}>
            <View style={styles.progressLabelRow}>
               <Text style={styles.progressText}>
                 {progressValue === 1 ? 'Finalizat' : 'În Curs'}
               </Text>
               <Text style={styles.progressPercent}>{Math.round(progressValue * 100)}%</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${progressValue * 100}%`, backgroundColor: cardColor }
                  ]} 
                />
            </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{marginTop: 10, color: '#666'}}>Se conectează la server...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bibliotecă Module</Text>
        <Text style={styles.headerSubtitle}>Cursuri disponibile online</Text>
      </View>

      <FlatList
        data={modules}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={{alignItems: 'center', marginTop: 50}}>
            <Ionicons name="server-outline" size={50} color="#ccc" />
            <Text style={{marginTop: 10, color: '#999'}}>Nu există cursuri în baza de date.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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