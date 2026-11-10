import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { STORAGE_KEYS } from '../constants/storageKeys';
import { webPointer } from '../utils/styles';
import { displayNameFromEmail } from '../utils/user';

const MenuItem = ({ icon, title, color = "#333", onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={[styles.menuIconContainer, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.menuText}>{title}</Text>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

const ToggleItem = ({ icon, title, color, value, onValueChange }) => (
  <View style={styles.menuItem}>
    <View style={[styles.menuIconContainer, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.menuText}>{title}</Text>
    <Switch
      trackColor={{ false: "#E0E0E0", true: color }}
      thumbColor={value ? "#fff" : "#f4f3f4"}
      onValueChange={onValueChange}
      value={value}
    />
  </View>
);

export default function ProfileScreen({ onLogout, navigation }) {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('Utilizator');
  const [isParentingMode, setIsParentingMode] = useState(false);

  useEffect(() => {
    const getPreferences = async () => {
      try {
        const email = await AsyncStorage.getItem(STORAGE_KEYS.userEmail);
        if (email) {
          setUserEmail(email);
          setUserName(displayNameFromEmail(email));
        }

        const mode = await AsyncStorage.getItem(STORAGE_KEYS.parentingMode);
        setIsParentingMode(mode === 'true');
      } catch (e) {
        console.log('Error loading user data', e);
      }
    };
    getPreferences();
  }, []);

  const toggleParentingMode = async () => {
    const newState = !isParentingMode;
    setIsParentingMode(newState);
    await AsyncStorage.setItem(STORAGE_KEYS.parentingMode, newState ? 'true' : 'false');

    // Jump to the course list so the change is visible right away.
    navigation.navigate("Modules");

    Alert.alert(
      "Modul Parenting",
      newState
        ? "Cursurile de parenting sunt acum vizibile."
        : "Cursurile de parenting au fost ascunse."
    );
  };

  const handleLogoutPress = () => {
    if (Platform.OS === 'web') {
        if (window.confirm("Ești sigur că vrei să ieși?")) onLogout();
    } else {
        Alert.alert(
          "Deconectare",
          "Ești sigur că vrei să ieși din aplicație?",
          [
            { text: "Anulează", style: "cancel" },
            { text: "Da, Ieși", style: "destructive", onPress: onLogout }
          ]
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* --- Header User --- */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
          <Text style={styles.nameText}>{userName}</Text>
          <Text style={styles.emailText}>{userEmail || 'Incarcare...'}</Text>

          {/* Placeholder: the age entered at registration is not stored yet. */}
          <View style={styles.ageBadge}>
            <Ionicons name="calendar-outline" size={14} color="#444" style={{marginRight: 5}}/>
            <Text style={styles.ageText}>21 ani</Text>
          </View>
        </View>

        {/* --- Secțiunea Setări --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Setări</Text>

          <ToggleItem
            icon="accessibility-outline"
            title="Modul Parenting"
            color="#FF69B4"
            value={isParentingMode}
            onValueChange={toggleParentingMode}
          />

          <MenuItem icon="person" title="Date Personale" color="#007AFF" />
          <MenuItem icon="notifications-outline" title="Notificări" color="#FFA500" />

          <MenuItem
            icon="construct-outline"
            title="Panou Admin (Demo)"
            color="#333"
            onPress={() => navigation.navigate('AdminDemo')}
          />
        </View>

        {/* --- Secțiunea Suport --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suport & Legal</Text>
          <MenuItem icon="help-circle-outline" title="Centru Ajutor" color="#4CAF50" />
          <MenuItem icon="document-text-outline" title="Termeni & Condiții" color="#607D8B" />
        </View>

        {/* --- Logout --- */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
          <Ionicons name="log-out-outline" size={24} color="#E53935" />
          <Text style={styles.logoutButtonText}>Deconectare</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 20, paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: 30, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  avatar: { backgroundColor: '#007AFF', width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 3, borderColor: '#fff', elevation: 5 },
  nameText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  emailText: { fontSize: 14, color: '#888', marginTop: 2 },

  ageBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 10
  },
  ageText: { fontSize: 13, color: '#444', fontWeight: '600' },

  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10, marginLeft: 5 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    ...webPointer
  },
  menuIconContainer: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, color: '#333' },

  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', padding: 15, borderRadius: 12, marginTop: 10, borderWidth: 1, borderColor: '#E5393520',
    ...webPointer
  },
  logoutButtonText: { fontSize: 16, color: '#E53935', fontWeight: 'bold', marginLeft: 10 },
});
