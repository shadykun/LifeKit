import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert 
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ApiService } from '../services/ApiService';

export default function ScenarioScreen({ navigation, route }) {
  // Primim ID-ul modulului curent pentru a ști ce să afișăm
  const { moduleId, moduleTitle } = route.params || {};

  const [viewMode, setViewMode] = useState('selection'); 
  const [loading, setLoading] = useState(false);
  
  // Date procesate (Pași combinați Text + Imagine)
  const [scenarioSteps, setScenarioSteps] = useState([]);
  const [videos, setVideos] = useState([]);

  // Indexul pasului curent
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // --- FETCH & PREPARE DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(`[Scenario] Încărcăm date pentru Module ID: ${moduleId}`);

        // 1. Luăm toate datele brute de pe server
        const [allTexts, allImages, allVideos] = await Promise.all([
          ApiService.getTexts(),
          ApiService.getImages(),
          ApiService.getVideos()
        ]);

        // 2. FILTRARE (Critică!)
        // Păstrăm doar elementele care aparțin acestui curs/modul.
        // Presupunem că backend-ul are un câmp 'course_id' sau similar.
        // Dacă backend-ul nu are acest câmp, va afișa tot (fallback).
        
        const filteredTexts = allTexts.filter(t => t.course_id == moduleId || !t.course_id);
        const filteredImages = allImages.filter(i => i.course_id == moduleId || !i.course_id);
        const filteredVideos = allVideos.filter(v => v.course_id == moduleId || !v.course_id);

        // 3. COMBINARE (Mapping)
        // Creăm o listă de "Pași" unde unim Textul[i] cu Imaginea[i]
        // Astfel ne asigurăm că rămân sincronizate.
        const combinedSteps = filteredTexts.map((textItem, index) => {
          // Încercăm să găsim imaginea corespunzătoare (aceeași poziție sau id similar)
          const imageItem = filteredImages[index] || null;
          
          return {
            id: textItem.id,
            text: textItem.content || textItem.text || "Fără text",
            imageUrl: imageItem ? (imageItem.url || imageItem.path) : null
          };
        });

        setScenarioSteps(combinedSteps);
        setVideos(filteredVideos);

      } catch (error) {
        console.error("Eroare scenariu:", error);
        Alert.alert("Eroare", "Nu am putut descărca conținutul lecției.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId]);

  // --- NAVIGARE INTERNĂ ---
  const handleNextStep = () => {
    if (currentStepIndex < scenarioSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Final de scenariu
      Alert.alert("Felicitări!", "Ai parcurs toți pașii acestei lecții.", [
        { text: "OK", onPress: goBackToMenu }
      ]);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const goBackToMenu = () => {
    setViewMode('selection');
    setCurrentStepIndex(0);
  };

  // =================================================
  // 1. MENIU SELECȚIE
  // =================================================
  const renderSelectionScreen = () => (
    <View style={styles.menuContainer}>
      <View style={styles.headerContainer}>
        <Ionicons name="school-outline" size={60} color="#007AFF" />
        <Text style={styles.menuTitle}>Lecție: {moduleTitle || "Curs"}</Text>
        <Text style={styles.menuSubtitle}>Cum vrei să înveți?</Text>
      </View>

      <TouchableOpacity 
        style={styles.modeCard} 
        onPress={() => setViewMode('interactive')}
      >
        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
          <Ionicons name="document-text" size={32} color="#1565C0" />
        </View>
        <View style={styles.cardTextContent}>
          <Text style={styles.modeTitle}>Ghid Pas cu Pas</Text>
          <Text style={styles.modeDesc}>
            {scenarioSteps.length} pași de parcurs cu text și imagini explicative.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.modeCard} 
        onPress={() => setViewMode('kids')}
      >
        <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
          <Ionicons name="videocam" size={32} color="#EF6C00" />
        </View>
        <View style={styles.cardTextContent}>
          <Text style={styles.modeTitle}>Video Demonstrativ</Text>
          <Text style={styles.modeDesc}>
            {videos.length > 0 ? "Vizionează clipul video." : "Momentan nu există video."}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>
    </View>
  );

  // =================================================
  // 2. MOD VIDEO
  // =================================================
  const renderKidsMode = () => {
    const currentVideo = videos.length > 0 ? videos[0] : null;

    return (
      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.backButtonTop} onPress={goBackToMenu}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}>Înapoi</Text>
        </TouchableOpacity>

        {currentVideo ? (
          <View style={styles.videoCard}>
            <View style={styles.videoPlayerPlaceholder}>
              <Ionicons name="play-circle" size={80} color="white" />
              <Text style={{color:'white', marginTop:10}}>VIDEO PLAYER</Text>
            </View>
            <Text style={styles.videoTitle}>{currentVideo.title || "Demonstrație Video"}</Text>
            <Text style={styles.videoDesc}>{currentVideo.description || "Urmărește procedura corectă."}</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="videocam-off" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Nu există video pentru acest modul.</Text>
          </View>
        )}
      </View>
    );
  };

  // =================================================
  // 3. MOD INTERACTIV (FIXAT)
  // =================================================
  const renderInteractiveMode = () => {
    if (scenarioSteps.length === 0) {
      return (
        <View style={styles.contentContainer}>
           <TouchableOpacity style={styles.backButtonTop} onPress={goBackToMenu}>
             <Ionicons name="arrow-back" size={24} color="#333" />
             <Text style={styles.backText}>Înapoi</Text>
           </TouchableOpacity>
           <View style={styles.emptyState}>
             <Ionicons name="library-outline" size={50} color="#ccc" />
             <Text style={styles.emptyText}>Această lecție nu are conținut text încă.</Text>
           </View>
        </View>
      );
    }

    // Datele pasului curent
    const currentStep = scenarioSteps[currentStepIndex];

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Navigare */}
        <View style={styles.navBar}>
           <TouchableOpacity onPress={goBackToMenu} style={styles.miniBackBtn}>
             <Ionicons name="close-circle" size={28} color="#007AFF"/>
           </TouchableOpacity>
           <Text style={styles.stepCounter}>Pasul {currentStepIndex + 1} / {scenarioSteps.length}</Text>
           <View style={{width: 28}} />
        </View>

        {/* --- IMAGINEA PASULUI --- */}
        <View style={styles.imageContainer}>
           {currentStep.imageUrl ? (
             <Image 
               source={{ uri: currentStep.imageUrl }} 
               style={styles.scenarioImage}
               resizeMode="cover"
             />
           ) : (
             <View style={styles.imagePlaceholder}>
               <Ionicons name="image-outline" size={50} color="#ccc" />
               <Text style={{color:'#999', marginTop: 5}}>Imagine indisponibilă</Text>
             </View>
           )}
        </View>

        {/* --- TEXTUL PASULUI --- */}
        <View style={styles.textCard}>
          <Text style={styles.questionText}>
            {currentStep.text}
          </Text>
        </View>

        {/* --- CONTROALE --- */}
        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={[styles.controlBtn, currentStepIndex === 0 && styles.disabledBtn]} 
            onPress={handlePrevStep}
            disabled={currentStepIndex === 0}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
            <Text style={styles.controlText}>Anterior</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlBtn, styles.nextBtn]} 
            onPress={handleNextStep}
          >
            <Text style={styles.controlText}>
              {currentStepIndex === scenarioSteps.length - 1 ? "Finalizare" : "Următor"}
            </Text>
            <Ionicons 
              name={currentStepIndex === scenarioSteps.length - 1 ? "checkmark-circle" : "arrow-forward"} 
              size={20} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>

      </ScrollView>
    );
  };

  // --- RENDER PRINCIPAL ---
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{marginTop: 10, color: '#666'}}>Pregătim lecția...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      {viewMode === 'selection' && renderSelectionScreen()}
      {viewMode === 'kids' && renderKidsMode()}
      {viewMode === 'interactive' && renderInteractiveMode()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F5F7FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Meniu
  menuContainer: { flex: 1, padding: 20, justifyContent: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  menuTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 5, textAlign: 'center' },
  menuSubtitle: { fontSize: 16, color: '#666' },
  
  modeCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, 
    borderRadius: 16, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity: 0.1 
  },
  iconBox: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardTextContent: { flex: 1, marginRight: 10 },
  modeTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  modeDesc: { fontSize: 13, color: '#666', lineHeight: 18 },

  // Common
  contentContainer: { flex: 1, padding: 20 },
  backButtonTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, alignSelf: 'flex-start' },
  backText: { fontSize: 16, fontWeight: '600', color: '#333', marginLeft: 5 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#999', marginTop: 10, fontSize: 16 },

  // Video
  videoCard: { backgroundColor: '#fff', borderRadius: 20, padding: 15, elevation: 3 },
  videoPlayerPlaceholder: { width: '100%', height: 220, backgroundColor: '#000', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  videoTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  videoDesc: { fontSize: 15, color: '#666', lineHeight: 22 },

  // Interactive
  scrollContent: { padding: 20, paddingBottom: 40 },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  miniBackBtn: { padding: 5 },
  stepCounter: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  
  imageContainer: { 
    width: '100%', height: 220, marginBottom: 25, backgroundColor: '#fff', 
    borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 2, overflow: 'hidden',
    borderWidth: 1, borderColor: '#eee'
  },
  scenarioImage: { width: '100%', height: '100%' },
  imagePlaceholder: { alignItems: 'center' },
  
  textCard: { backgroundColor: '#fff', padding: 25, borderRadius: 16, marginBottom: 30, elevation: 2, minHeight: 150, justifyContent: 'center' },
  questionText: { fontSize: 18, color: '#333', lineHeight: 28, textAlign: 'center', fontWeight: '500' },
  
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  controlBtn: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#90A4AE', 
    paddingVertical: 14, paddingHorizontal: 24, borderRadius: 30 
  },
  nextBtn: { backgroundColor: '#007AFF' },
  disabledBtn: { backgroundColor: '#E0E0E0', opacity: 0.7 },
  controlText: { color: '#fff', fontWeight: 'bold', marginHorizontal: 8, fontSize: 16 },
});