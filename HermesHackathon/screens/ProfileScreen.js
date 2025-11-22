import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen({ onLogout }) {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const getEmail = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      setUserEmail(email);
    };
    getEmail();
  }, []);

  const handleLogoutPress = () => {
    Alert.alert(
      "Deconectare",
      "Ești sigur că vrei să ieși din aplicație?",
      [
        { text: "Anulează", style: "cancel" },
        { text: "Da, Ieși", style: "destructive", onPress: onLogout }
      ]
    );
  };

  // Componentă helper pentru elementele din meniu
  const MenuItem = ({ icon, title, color = "#333" }) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={[styles.menuIconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.menuText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header Profile */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
             <Image
               source={{ uri: 'https://img.icons8.com/bubbles/200/user.png' }}
               style={styles.avatar}
             />
             <View style={styles.editBadge}>
                <Ionicons name="pencil" size={14} color="#fff" />
             </View>
          </View>
          <Text style={styles.nameText}>Student Salvator</Text>
          <Text style={styles.emailText}>{userEmail || 'guest@app.com'}</Text>
        </View>

        {/* Secțiunea Setări Generale */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contul Meu</Text>
          <MenuItem icon="person" title="Date Personale" color="#007AFF" />
          <MenuItem icon="shield-checkmark" title="Securitate & Parolă" color="#007AFF" />
          <MenuItem icon="notifications" title="Notificări" color="#FF9800" />
        </View>

        {/* Secțiunea Suport */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suport</Text>
          <MenuItem icon="help-circle" title="Întrebări Frecvente" color="#4CAF50" />
          <MenuItem icon="document-text" title="Termeni și Condiții" color="#607D8B" />
        </View>

        {/* Buton Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
          <Ionicons name="log-out-outline" size={24} color="#FF4B4B" style={{marginRight: 10}}/>
          <Text style={styles.logoutText}>Deconectare</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>v1.0.0 Beta</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 20, paddingBottom: 40 },
  
  header: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#007AFF', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#F5F7FA' },
  nameText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  emailText: { fontSize: 14, color: '#888', marginTop: 2 },

  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10, marginLeft: 5 },
  
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  menuIconContainer: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, color: '#333' },

  logoutButton: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10, borderWidth: 1, borderColor: '#FFEBEE' },
  logoutText: { color: '#FF4B4B', fontSize: 16, fontWeight: '600' },
  
  versionText: { textAlign: 'center', color: '#ccc', marginTop: 20, fontSize: 12 }
});