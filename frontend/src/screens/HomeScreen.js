import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { STORAGE_KEYS } from '../constants/storageKeys';
import { displayNameFromEmail } from '../utils/user';

export default function HomeScreen() {
  const [userName, setUserName] = useState('Salvator');

  useEffect(() => {
    const getName = async () => {
      try {
        const email = await AsyncStorage.getItem(STORAGE_KEYS.userEmail);
        if (email) {
          setUserName(displayNameFromEmail(email));
        }
      } catch (e) {
        console.log('Error loading name', e);
      }
    };
    getName();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.greetingText}>Salut, {userName}!</Text>
            <Text style={styles.subGreeting}>Ești gata să salvezi vieți?</Text>
          </View>
          <Image
             source={{ uri: 'https://img.icons8.com/color/96/paramedic.png' }}
             style={styles.avatarSmall}
          />
        </View>

        <Text style={styles.sectionTitle}>Continuă învățarea</Text>
        {/* Static placeholder content: progress is not tracked yet. */}
        <TouchableOpacity style={styles.continueCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="heart-circle" size={45} color="#FF4B4B" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Resuscitare (RCP)</Text>
            <Text style={styles.cardSubtitle}>Modulul 2 • 60% Complet</Text>
            <View style={styles.progressBarBg}>
                <View style={styles.progressBarFill} />
            </View>
          </View>
          <Ionicons name="play-circle" size={36} color="#007AFF" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Sfatul Zilei</Text>
        <View style={styles.tipContainer}>
          <Ionicons name="bulb" size={28} color="#FFA500" style={{marginTop: 2}} />
          <View style={{marginLeft: 12, flex: 1}}>
             <Text style={styles.tipTitle}>Arsuri Termice</Text>
             <Text style={styles.tipText}>
                Răcește zona cu apă călduță (nu gheață!) timp de 20 de minute imediat după accident.
             </Text>
          </View>
        </View>

        <View style={styles.quickActionsRow}>
           <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#E3F2FD'}]}>
              <Ionicons name="book" size={24} color="#1565C0"/>
              <Text style={[styles.actionText, {color: '#1565C0'}]}>Ghid PDF</Text>
           </TouchableOpacity>

           <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#FFEBEE'}]}>
              <Ionicons name="call" size={24} color="#C62828"/>
              <Text style={[styles.actionText, {color: '#C62828'}]}>Urgență</Text>
           </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#333',
  },
  subGreeting: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },
  avatarSmall: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.05)',
  },
  iconContainer: {
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
    marginTop: 2,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    width: '100%',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#007AFF',
    borderRadius: 3,
    width: '60%',
  },
  tipContainer: {
    backgroundColor: '#FFF8E1',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 5,
    borderLeftColor: '#FFA500',
    marginBottom: 30,
  },
  tipTitle: {
      fontWeight: 'bold',
      color: '#D84315',
      marginBottom: 4,
      fontSize: 15,
  },
  tipText: {
    color: '#5D4037',
    fontSize: 14,
    lineHeight: 22,
  },
  quickActionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
  },
  actionButton: {
      flex: 0.48,
      padding: 15,
      borderRadius: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
  },
  actionText: {
      marginLeft: 8,
      fontWeight: 'bold',
      fontSize: 14,
  }
});
