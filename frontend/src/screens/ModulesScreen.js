import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoadingView from '../components/LoadingView';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { ApiService } from '../services/api';
import { webPointer } from '../utils/styles';

const PARENTING_COLOR = '#FF69B4';

export default function ModulesScreen({ navigation }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourses = async () => {
    try {
      const isParenting = (await AsyncStorage.getItem(STORAGE_KEYS.parentingMode)) === 'true';
      const data = await ApiService.getCourses();
      const courses = Array.isArray(data) ? data : [];

      // Parenting courses are hidden unless the user enabled them in the profile.
      const visibleCourses = isParenting ? courses : courses.filter((course) => !course.parenting);

      setModules(
        visibleCourses.map((course, index) => ({
          ...course,
          // Placeholder progress until real progress tracking exists.
          progress: ((index + 1) * 0.3) % 1,
          color: course.parenting ? PARENTING_COLOR : course.color || '#4CAF50',
        }))
      );
    } catch (error) {
      if (Platform.OS !== 'web') Alert.alert("Eroare", "Nu am putut încărca cursurile.");
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refetch on every focus so a parenting-mode change made in the profile shows up.
  useEffect(() => navigation.addListener('focus', fetchCourses), [navigation]);

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
            {item.parenting && <Text style={styles.parentingLabel}>CURS PARENTING</Text>}
            <Text style={styles.cardDesc}>{item.description || 'Descriere curs.'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </View>

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
    return <LoadingView message="Se încarcă modulele..." />;
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
    ...webPointer
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconContainer: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textContainer: { flex: 1, marginRight: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  parentingLabel: { fontSize: 12, color: PARENTING_COLOR, fontWeight: 'bold', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#666', lineHeight: 18 },
  progressContainer: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  progressText: { fontSize: 12, color: '#666', marginBottom: 5, fontWeight: '500' },
  progressBarBg: { height: 6, backgroundColor: '#E0E0E0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
});
