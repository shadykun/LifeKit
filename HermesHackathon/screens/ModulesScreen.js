import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, StatusBar, 
  ActivityIndicator, Alert, RefreshControl, Platform 
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { ApiService } from '../services/ApiService'; 

export default function ModulesScreen({ navigation }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isParentingMode, setIsParentingMode] = useState(false); 

  const fetchCourses = async () => {
    try {
      // PAS 1: Preluăm preferința utilizatorului
      const parentingMode = await AsyncStorage.getItem('parentingMode');
      const isParenting = parentingMode === 'true';
      setIsParentingMode(isParenting); 

      console.log('Parenting Mode from AsyncStorage:', parentingMode, '(isParenting:', isParenting, ')');

      // PAS 2: Preluăm cursurile de la API
      const data = await ApiService.getCourses();
      
      if (Array.isArray(data)) {
        console.log('Raw courses data from API:', data);
        
        let filteredData = data;
        
        // PAS 3: FILTRARE
        if (!isParenting) {
            filteredData = data.filter(item => item.parenting !== true);
            console.log('Filtered courses (parenting mode OFF):', filteredData);
        } else {
            console.log('No filtering applied (parenting mode ON). Displaying all courses.');
        }

        // PAS 4: Procesarea datelor și setarea culorii ROZ
        const processed = filteredData.map((item, index) => {
            
            let color = item.parenting ? '#FF69B4' : (item.color || '#4CAF50');
            
            return {
                ...item,
                progress: ((index + 1) * 0.3) % 1,
                color: color 
            }
        });
        
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

  // Reîncărcăm cursurile de fiecare dată când revenim pe acest ecran
  useEffect(() => { 
    // Această logică este crucială pentru a vedea schimbarea din ProfileScreen
    const unsubscribe = navigation.addListener('focus', () => {
        fetchCourses();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  const renderItem = ({ item }) => {
    const iconName = item.icon || (item.parenting ? 'heart-circle-outline' : 'book'); 
    const cardColor = item.color; 

    return (
      <TouchableOpacity 
        style={[
          styles.card, 
          {borderColor: item.parenting ? cardColor : '#eee', borderWidth: item.parenting ? 1 : 0} 
        ]} 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ModuleDetail', { moduleData: item })}
      >
        <View style={styles.cardTop}>
          <View style={[styles.iconContainer, { backgroundColor: cardColor + '20' }]}>
             <Ionicons name={iconName} size={28} color={cardColor} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.parenting && <Text style={{fontSize: 12, color: '#FF69B4', fontWeight: 'bold', marginBottom: 4}}>CURS PARENTING</Text>}
            <Text style={styles.cardDesc}>{item.description || 'Descriere curs.'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </View>

        {/* Indicator de Progres */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{Math.round(item.progress * 100)}% Completat</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${item.progress * 100}%`, backgroundColor: cardColor }]} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{marginTop: 10, color: '#555'}}>Se încarcă modulele...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.webWrapper}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Module de Învățare</Text>
          <Text style={styles.headerSubtitle}>Alege ce vrei să studiezi azi.</Text>
        </View>
        
        <FlatList
          data={modules}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{color: '#999', fontSize: 16}}>Nu s-au găsit module disponibile.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  progressContainer: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  progressText: { fontSize: 12, color: '#666', marginBottom: 5, fontWeight: '500' },
  progressBarBg: { height: 6, backgroundColor: '#E0E0E0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
});