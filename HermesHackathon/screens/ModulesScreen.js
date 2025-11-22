import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, StatusBar, 
  ActivityIndicator, Alert, RefreshControl, Platform 
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ApiService } from '../services/ApiService'; 

export default function ModulesScreen({ navigation }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourses = async () => {
    try {
      const data = await ApiService.getCourses();
      if (Array.isArray(data)) {
        // Adăugăm progres fictiv pentru vizual
        const processed = data.map((item, index) => ({
            ...item,
            progress: ((index + 1) * 0.3) % 1 
        }));
        setModules(processed);
      } else {
        setModules([]);
      }
    } catch (error) {
      if (Platform.OS !== 'web') Alert.alert("Eroare", "Nu am putut încărca cursurile.");
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  const renderItem = ({ item }) => {
    const iconName = item.icon || 'book';
    const cardColor = item.color || '#4CAF50';
    const title = item.title || item.name || 'Curs Fără Titlu';
    const desc = item.description || '...';
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

        <View style={styles.progressContainer}>
            <View style={styles.progressLabelRow}>
               <Text style={styles.progressText}>{progressValue === 1 ? 'Finalizat' : 'În Curs'}</Text>
               <Text style={styles.progressPercent}>{Math.round(progressValue * 100)}%</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progressValue * 100}%`, backgroundColor: cardColor }]} />
            </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bibliotecă Module</Text>
        <Text style={styles.headerSubtitle}>Cursuri disponibile</Text>
      </View>

      <View style={styles.webWrapper}>
        <FlatList
          data={modules}
          keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={Platform.OS !== 'web' ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : null}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  headerSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  webWrapper: { flex: 1, alignSelf: 'center', width: '100%', maxWidth: 600 },
  listContent: { padding: 20 },
  card: { 
    backgroundColor: '#fff', borderRadius: 16, padding: 15, marginBottom: 15, 
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 3,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {})
  },
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