import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Linking
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import LoadingView from '../components/LoadingView';
import { ApiService } from '../services/api';

// Texts, images and videos are matched to a course by whichever id field they carry.
const belongsToModule = (item, moduleId) =>
  String(item.course_id || item.chapter_id || item.moduleId || item.id) === String(moduleId);

export default function ScenarioScreen({ navigation, route }) {
  const { moduleId, moduleTitle } = route.params || {};

  const [viewMode, setViewMode] = useState('selection'); // 'selection' | 'interactive' | 'kids'
  const [loading, setLoading] = useState(false);
  const [scenarioSteps, setScenarioSteps] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [allTexts, allImages, allVideos] = await Promise.all([
          ApiService.getTexts(),
          ApiService.getImages(),
          ApiService.getVideos()
        ]);

        const relevantTexts = allTexts.filter(item => belongsToModule(item, moduleId));
        const relevantImages = allImages.filter(item => belongsToModule(item, moduleId));
        const relevantVideos = allVideos.filter(item => belongsToModule(item, moduleId));

        // One step per text, illustrated by the image at the same position (or the first one).
        const steps = relevantTexts.map((textItem, index) => {
          const imageItem = relevantImages[index] || relevantImages[0] || null;

          return {
            id: textItem.id,
            text: textItem.body_content || textItem.text || "Text indisponibil",
            imageUrl: imageItem ? (imageItem.url || imageItem.path || imageItem.link) : null
          };
        });

        setScenarioSteps(steps);
        setVideos(relevantVideos);
      } catch (error) {
        console.error("[Scenario Error]", error);
        Alert.alert("Eroare", "Nu am putut descărca datele.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId]);

  const handleNextStep = () => {
    if (currentStepIndex < scenarioSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      Alert.alert("Felicitări!", "Ai parcurs toată lecția.", [
        { text: "Înapoi la Meniu", onPress: goBackToMenu }
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

  const openVideoLink = async (url) => {
    if (!url) {
      Alert.alert("Ups!", "Nu există un link valid pentru acest video.");
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Eroare", "Nu pot deschide acest link: " + url);
      }
    } catch (err) {
      console.error("Eroare la deschiderea link-ului:", err);
      Alert.alert("Eroare", "Ceva nu a mers bine la deschiderea videoclipului.");
    }
  };

  const renderSelectionScreen = () => (
    <View style={styles.menuContainer}>
      <View style={styles.headerContainer}>
        <Ionicons name="school-outline" size={60} color="#007AFF" />
        <Text style={styles.menuTitle}>Lecție: {moduleTitle || "Curs"}</Text>
        <Text style={styles.menuSubtitle}>Alege metoda de învățare</Text>
      </View>

      <TouchableOpacity style={styles.modeCard} onPress={() => setViewMode('interactive')}>
        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
          <Ionicons name="document-text" size={32} color="#1565C0" />
        </View>
        <View style={styles.cardTextContent}>
          <Text style={styles.modeTitle}>Ghid Pas cu Pas</Text>
          <Text style={styles.modeDesc}>Citește instrucțiunile și vizualizează imaginile.</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.modeCard} onPress={() => setViewMode('kids')}>
        <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
          <Ionicons name="videocam" size={32} color="#EF6C00" />
        </View>
        <View style={styles.cardTextContent}>
          <Text style={styles.modeTitle}>Video Demonstrativ</Text>
          <Text style={styles.modeDesc}>Vizionează clipul video explicativ.</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>
    </View>
  );

  const renderInteractiveMode = () => {
    if (scenarioSteps.length === 0) {
      return (
        <View style={styles.centerContent}>
          <Ionicons name="library-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Nu am găsit text pentru acest ID ({moduleId}).</Text>
          <TouchableOpacity style={styles.backTextBtn} onPress={goBackToMenu}>
            <Text style={{color: '#007AFF', fontWeight: 'bold'}}>Înapoi la Meniu</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const currentStep = scenarioSteps[currentStepIndex];

    return (
      <View style={{flex: 1}}>
        <View style={styles.lessonHeaderBar}>
          <TouchableOpacity onPress={goBackToMenu} style={{padding: 5}}>
            <Ionicons name="close" size={24} color="#333"/>
          </TouchableOpacity>
          <Text style={styles.lessonProgressText}>
            Pagina {currentStepIndex + 1} din {scenarioSteps.length}
          </Text>
          <View style={{width: 24}} />
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${((currentStepIndex + 1) / scenarioSteps.length) * 100}%` }]} />
        </View>

        <ScrollView contentContainerStyle={styles.lessonScrollContent}>
          <Text style={styles.stepTitle}>Pasul {currentStepIndex + 1}</Text>

          {currentStep.imageUrl ? (
            <Image
              source={{ uri: currentStep.imageUrl }}
              style={styles.lessonImage}
              resizeMode="cover"
            />
          ) : null}

          <View style={styles.lessonBody}>
            <Text style={styles.lessonText}>
              {currentStep.text}
            </Text>
          </View>
        </ScrollView>

        <View style={styles.lessonFooter}>
          <TouchableOpacity
            style={[styles.navBtn, currentStepIndex === 0 && styles.disabledNavBtn]}
            onPress={handlePrevStep}
            disabled={currentStepIndex === 0}
          >
            <Ionicons name="chevron-back" size={20} color={currentStepIndex === 0 ? "#ccc" : "#333"} />
            <Text style={[styles.navBtnText, currentStepIndex === 0 && {color: '#ccc'}]}>Înapoi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navBtn, styles.nextNavBtn]}
            onPress={handleNextStep}
          >
            <Text style={[styles.navBtnText, {color: '#fff'}]}>
              {currentStepIndex === scenarioSteps.length - 1 ? "Finalizare" : "Următorul Pas"}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderKidsMode = () => {
    const currentVideo = videos.length > 0 ? videos[0] : null;
    const videoUrl = currentVideo ? (currentVideo.url || currentVideo.link || currentVideo.path) : null;

    return (
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={goBackToMenu} style={styles.backRow}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backLabel}>Înapoi</Text>
        </TouchableOpacity>

        {currentVideo && videoUrl ? (
          <View style={styles.kidsContainer}>
            <Text style={styles.kidsTitle}>Salut, micule salvator! 👋</Text>
            <Text style={styles.kidsSubtitle}>Urmărește acest video ca să înveți cum să ajuți.</Text>

            <TouchableOpacity
              style={styles.youtubeCard}
              activeOpacity={0.9}
              onPress={() => openVideoLink(videoUrl)}
            >
              <View style={styles.thumbnailContainer}>
                <View style={styles.playButtonCircle}>
                  <Ionicons name="play" size={40} color="#FF0000" style={{marginLeft: 5}} />
                </View>
                <Text style={styles.watchText}>Vizionează pe YouTube</Text>
              </View>

              <View style={styles.videoInfo}>
                <Text style={styles.videoCardTitle}>{currentVideo.title || "Lecție Video"}</Text>
                <Text style={styles.videoCardDesc}>{currentVideo.description || "Învață primii pași în siguranță."}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.noteBox}>
              <Ionicons name="information-circle-outline" size={24} color="#555" />
              <Text style={styles.noteText}>
                Vei fi redirecționat către aplicația YouTube pentru a vedea filmulețul.
              </Text>
            </View>

          </View>
        ) : (
          <View style={styles.centerContent}>
            <Ionicons name="videocam-off-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Nu am găsit niciun video distractiv pentru acest modul.</Text>
            <TouchableOpacity style={styles.backTextBtn} onPress={goBackToMenu}>
              <Text style={{color: '#007AFF', fontWeight: 'bold'}}>Încearcă alt mod</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return <LoadingView message="Încărcăm datele..." />;
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      {viewMode === 'selection' && renderSelectionScreen()}
      {viewMode === 'interactive' && renderInteractiveMode()}
      {viewMode === 'kids' && renderKidsMode()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F5F7FA' },

  menuContainer: { flex: 1, padding: 20, justifyContent: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  menuTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 15 },
  menuSubtitle: { fontSize: 16, color: '#666' },
  modeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 20, elevation: 3 },
  iconBox: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardTextContent: { flex: 1, marginRight: 10 },
  modeTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modeDesc: { fontSize: 13, color: '#666' },

  kidsContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 10 },
  kidsTitle: { fontSize: 26, fontWeight: 'bold', color: '#FF9800', marginBottom: 8, textAlign: 'center' },
  kidsSubtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },

  youtubeCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5,
    marginBottom: 30,
    borderWidth: 1, borderColor: '#eee'
  },
  thumbnailContainer: {
    height: 180,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonCircle: {
    width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10
  },
  watchText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  videoInfo: { padding: 20 },
  videoCardTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  videoCardDesc: { fontSize: 14, color: '#666', lineHeight: 20 },

  noteBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD',
    padding: 15, borderRadius: 12, marginHorizontal: 10
  },
  noteText: { flex: 1, marginLeft: 10, color: '#1565C0', fontSize: 14 },

  lessonHeaderBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  lessonProgressText: { fontSize: 14, fontWeight: '600', color: '#666' },
  progressBarContainer: { height: 3, backgroundColor: '#E0E0E0', width: '100%' },
  progressBarFill: { height: '100%', backgroundColor: '#007AFF' },
  lessonScrollContent: { padding: 20, paddingBottom: 100 },
  stepTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 0.5 },
  lessonImage: { width: '100%', height: 220, borderRadius: 12, marginBottom: 25, backgroundColor: '#eee' },
  lessonBody: { marginTop: 0 },
  lessonText: { fontSize: 18, lineHeight: 28, color: '#2c3e50', textAlign: 'left' },
  lessonFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', flexDirection: 'row', padding: 15, justifyContent: 'space-between', alignItems: 'center' },
  navBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  nextNavBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20 },
  disabledNavBtn: { opacity: 0.5 },
  navBtnText: { fontSize: 16, fontWeight: '600', color: '#333', marginHorizontal: 5 },

  contentContainer: { padding: 20, flex: 1 },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, alignSelf: 'flex-start' },
  backLabel: { fontSize: 16, fontWeight: 'bold', color: '#333', marginLeft: 5 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#999', fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 10 },
  backTextBtn: { padding: 10 }
});
