import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Linking, Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Import the new data structures
import { CPR_COURSE, CPR_ANIMATED_URL } from '../ScenarioData'; 

export default function ScenarioScreen({ navigation }) {

  const [viewMode, setViewMode] = useState('selection'); 

  // Reset function to go back to the selection menu
  const goBackToMenu = () => {
    setViewMode('selection');
  };

  // --- RENDER FUNCTIONS FOR EACH VIEW MODE ---

  // 1. Main Menu / Selection Screen
  const renderSelectionScreen = () => (
    <View style={styles.menuContainer}>
      <View style={styles.headerContainer}>
        <Ionicons name="school-outline" size={60} color="#007AFF" />
        <Text style={styles.menuTitle}>Alege Modul de Învățare</Text>
        <Text style={styles.menuSubtitle}>Cum preferi să înveți pașii de prim ajutor?</Text>
      </View>

      <TouchableOpacity 
        style={styles.modeCard} 
        activeOpacity={0.9}
        onPress={() => setViewMode('course')} // Set view to the new course mode
      >
        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
          <Ionicons name="document-text" size={32} color="#1565C0" />
        </View>
        <View style={styles.cardTextContent}>
          <Text style={styles.modeTitle}>Curs Ghidat (Text + Imagini)</Text>
          <Text style={styles.modeDesc}>
            Învață pașii esențiali RCP printr-un ghid detaliat, ilustrat pas cu pas.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.modeCard} 
        activeOpacity={0.9}
        onPress={() => setViewMode('animated')} // Set view to the new animated mode
      >
        <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
          <Ionicons name="logo-youtube" size={32} color="#EF6C00" />
        </View>
        <View style={styles.cardTextContent}>
          <Text style={styles.modeTitle}>Mod Video Animat</Text>
          <Text style={styles.modeDesc}>
            Urmărește o animație video pe YouTube pentru o învățare vizuală și rapidă.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>
    </View>
  );

  // 2. Animated Video Mode Screen
  const handleOpenYouTube = async () => {
    const supported = await Linking.canOpenURL(CPR_ANIMATED_URL);
    if (supported) {
      await Linking.openURL(CPR_ANIMATED_URL);
    } else {
      Alert.alert("Eroare", `Nu se poate deschide URL-ul: ${CPR_ANIMATED_URL}`);
    }
  };

  const renderAnimatedMode = () => (
    <SafeAreaView style={styles.mainContainer}>
        <View style={styles.navBar}>
           <TouchableOpacity onPress={goBackToMenu} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color="#007AFF"/>
             <Text style={styles.backButtonText}>Meniu</Text>
           </TouchableOpacity>
        </View>
        <View style={styles.animatedContainer}>
            <Ionicons name="film-outline" size={80} color="#EF6C00" />
            <Text style={styles.animatedTitle}>Gata de vizionare?</Text>
            <Text style={styles.animatedDesc}>
                Apasă butonul de mai jos pentru a deschide videoclipul explicativ pe YouTube. Vei învăța rapid și corect cum se aplică manevrele de resuscitare.
            </Text>
            <TouchableOpacity style={styles.youtubeBtn} onPress={handleOpenYouTube}>
                <Ionicons name="logo-youtube" size={24} color="white" />
                <Text style={styles.youtubeBtnText}>Deschide pe YouTube</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );

  // 3. Text & Image Course Mode Screen
  const renderCourseMode = () => {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.navBar}>
           <TouchableOpacity onPress={goBackToMenu} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color="#007AFF"/>
             <Text style={styles.backButtonText}>Meniu</Text>
           </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.courseContent}>
            <Text style={styles.courseMainTitle}>Ghid de Resuscitare Cardio-Pulmonară (RCP)</Text>
            {CPR_COURSE.map((step) => (
            <View key={step.id} style={styles.stepCard}>
                <Image source={{ uri: step.image }} style={styles.stepImage} resizeMode="contain" />
                <View style={styles.stepTextContainer}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepText}>{step.text}</Text>
                </View>
            </View>
            ))}
        </ScrollView>
      </SafeAreaView>
    );
  };

  // --- Main Render Logic ---
  return (
    <SafeAreaView style={styles.mainContainer}>
      {viewMode === 'selection' && renderSelectionScreen()}
      {viewMode === 'animated' && renderAnimatedMode()}
      {viewMode === 'course' && renderCourseMode()}
    </SafeAreaView>
  );
}

// Re-styled for the new components
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F5F7FA' },
  
  // Selection Screen Styles
  menuContainer: { flex: 1, padding: 20, justifyContent: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  menuTitle: { fontSize: 26, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 5, textAlign: 'center' },
  menuSubtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
  modeCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, 
    borderRadius: 20, marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 
  },
  iconBox: { width: 60, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardTextContent: { flex: 1, marginRight: 10 },
  modeTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  modeDesc: { fontSize: 13, color: '#666', lineHeight: 18 },

  // Shared Nav Bar
  navBar: { paddingHorizontal: 15, paddingVertical: 10, width: '100%' },
  backButton: { flexDirection:'row', alignItems:'center', padding: 5 },
  backButtonText: { color:'#007AFF', marginLeft: 5, fontWeight:'bold', fontSize: 16 },

  // Animated Mode Styles
  animatedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' },
  animatedTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 15, marginTop: 20 },
  animatedDesc: { fontSize: 16, color: '#555', textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  youtubeBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
  },
  youtubeBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // Course Mode Styles
  courseContent: { paddingHorizontal: 15, paddingBottom: 30 },
  courseMainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    overflow: 'hidden', // Ensures the image corners are also rounded
  },
  stepImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#E3F2FD' // A light background for the image container
  },
  stepTextContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  stepText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  }
});