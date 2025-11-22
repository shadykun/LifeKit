import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  ActivityIndicator, Animated, Dimensions 
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ApiService } from '../services/ApiService';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function FlashcardsScreen({ navigation, route }) {
  // Parametrii primiți din ModuleDetail (dacă există)
  const { moduleId, moduleTitle } = route.params || {};

  const [allCards, setAllCards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State pentru navigare și animație
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Valoarea animată pentru rotație (0 -> 180)
  const flipAnim = useRef(new Animated.Value(0)).current;

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await ApiService.getFlashcards();
        
        let filteredData = data;
        
        // Încercăm filtrare client-side dacă avem moduleId și datele au course_id
        // Dacă backend-ul nu are course_id, afișăm tot ce primim
        if (moduleId && Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('course_id')) {
           filteredData = data.filter(card => card.course_id == moduleId);
        }

        setAllCards(filteredData);
      } catch (error) {
        console.error("Eroare Flashcards:", error);
        // Putem pune date fake de test aici dacă serverul e jos
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [moduleId]);

  // --- LOGICA DE FLIP ---
  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(flipAnim, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnim, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  // --- NAVIGARE CARDURI ---
  const nextCard = () => {
    if (currentIndex < allCards.length - 1) {
      // Resetăm flip-ul înainte de a schimba cardul
      if (isFlipped) flipCard();
      
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 150); // Mic delay pentru a arăta frumos
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      if (isFlipped) flipCard();
      
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
      }, 150);
    }
  };

  // --- INTERPOLĂRI PENTRU ANIMAȚIE ---
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0]
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1]
  });

  // --- RENDER LOADING & EMPTY ---
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{marginTop: 10, color: '#666'}}>Încărcăm cardurile...</Text>
      </View>
    );
  }

  if (allCards.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="albums-outline" size={60} color="#ccc" />
        <Text style={{marginTop: 10, color: '#666', fontSize: 16}}>Nu există flashcard-uri disponibile.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Înapoi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentCard = allCards[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentIndex + 1} / {allCards.length}
        </Text>
        <View style={{width: 28}} /> 
      </View>

      <View style={styles.content}>
        <Text style={styles.moduleLabel}>{moduleTitle || "Exersare"}</Text>
        
        <TouchableOpacity activeOpacity={1} onPress={flipCard} style={styles.cardWrapper}>
          
          {/* FAȚA CARDULUI */}
          <Animated.View style={[
            styles.card, 
            styles.cardFront, 
            { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacity }
          ]}>
            <Text style={styles.cardLabel}>ÎNTREBARE</Text>
            <Text style={styles.cardText}>
              {currentCard.front_text || currentCard.question || "Întrebare lipsă"}
            </Text>
            <Text style={styles.tapHint}>Apasă pentru a întoarce</Text>
          </Animated.View>

          {/* SPATELE CARDULUI */}
          <Animated.View style={[
            styles.card, 
            styles.cardBack, 
            { transform: [{ rotateY: backInterpolate }], opacity: backOpacity }
          ]}>
            <Text style={styles.cardLabel}>RĂSPUNS</Text>
            <Text style={styles.cardText}>
              {currentCard.back_text || currentCard.answer || "Răspuns lipsă"}
            </Text>
            <Text style={styles.tapHint}>Apasă pentru a întoarce</Text>
          </Animated.View>

        </TouchableOpacity>
      </View>

      {/* CONTROL NAVIGARE */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.navBtn, currentIndex === 0 && styles.disabledBtn]} 
          onPress={prevCard}
          disabled={currentIndex === 0}
        >
          <Ionicons name="arrow-back" size={24} color={currentIndex === 0 ? "#ccc" : "#333"} />
          <Text style={[styles.navText, currentIndex === 0 && {color: '#ccc'}]}>Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navBtn, currentIndex === allCards.length - 1 && styles.disabledBtn]} 
          onPress={nextCard}
          disabled={currentIndex === allCards.length - 1}
        >
          <Text style={[styles.navText, currentIndex === allCards.length - 1 && {color: '#ccc'}]}>Următor</Text>
          <Ionicons name="arrow-forward" size={24} color={currentIndex === allCards.length - 1 ? "#ccc" : "#333"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  moduleLabel: { fontSize: 14, color: '#888', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 },
  
  cardWrapper: { width: SCREEN_WIDTH - 60, height: 400, alignItems: 'center', justifyContent: 'center' },
  
  card: {
    width: '100%', height: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden', // Critic pentru animația de flip
    position: 'absolute', // Suprapunem fețele
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  
  cardFront: { backgroundColor: '#fff' },
  cardBack: { backgroundColor: '#E8F5E9' }, // Verde deschis pentru spate
  
  cardLabel: { position: 'absolute', top: 20, fontSize: 12, fontWeight: 'bold', color: '#ccc' },
  cardText: { fontSize: 22, fontWeight: '600', color: '#333', textAlign: 'center', lineHeight: 30 },
  tapHint: { position: 'absolute', bottom: 20, fontSize: 12, color: '#999' },

  footer: { flexDirection: 'row', justifyContent: 'space-between', padding: 30, paddingBottom: 40 },
  navBtn: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  navText: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 8, color: '#333' },
  disabledBtn: { opacity: 0.5 },
  
  backButton: { marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#fff', borderRadius: 20 },
  backButtonText: { color: '#333', fontWeight: 'bold' }
});