import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import LoadingView from '../components/LoadingView';
import { ApiService } from '../services/api';

const SCREEN_WIDTH = Dimensions.get('window').width;
// Lets the card flip back before the next card's text is shown.
const CARD_CHANGE_DELAY_MS = 150;

export default function FlashcardsScreen({ navigation, route }) {
  const { moduleId, moduleTitle } = route.params || {};

  const [allCards, setAllCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Card rotation in degrees: 0 shows the front, 180 the back.
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await ApiService.getFlashcards();

        // The API returns every flashcard; keep the ones of this course. If the cards
        // carry no course_id (or no module was given), show them all.
        const canFilter = moduleId && Array.isArray(data) && data.length > 0 && 'course_id' in data[0];
        setAllCards(canFilter ? data.filter(card => card.course_id == moduleId) : data);
      } catch (error) {
        console.error("Eroare Flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [moduleId]);

  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === allCards.length - 1;

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  // step is +1 (next) or -1 (previous)
  const changeCard = (step) => {
    if (isFlipped) flipCard();
    setTimeout(() => setCurrentIndex(prev => prev + step), CARD_CHANGE_DELAY_MS);
  };

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

  if (loading) {
    return <LoadingView message="Încărcăm cardurile..." />;
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

          {/* Front */}
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

          {/* Back */}
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

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navBtn, isFirstCard && styles.disabledBtn]}
          onPress={() => changeCard(-1)}
          disabled={isFirstCard}
        >
          <Ionicons name="arrow-back" size={24} color={isFirstCard ? "#ccc" : "#333"} />
          <Text style={[styles.navText, isFirstCard && styles.disabledText]}>Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, isLastCard && styles.disabledBtn]}
          onPress={() => changeCard(1)}
          disabled={isLastCard}
        >
          <Text style={[styles.navText, isLastCard && styles.disabledText]}>Următor</Text>
          <Ionicons name="arrow-forward" size={24} color={isLastCard ? "#ccc" : "#333"} />
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
    backfaceVisibility: 'hidden', // required by the flip animation
    position: 'absolute', // both faces are stacked on top of each other
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },

  cardFront: { backgroundColor: '#fff' },
  cardBack: { backgroundColor: '#E8F5E9' },

  cardLabel: { position: 'absolute', top: 20, fontSize: 12, fontWeight: 'bold', color: '#ccc' },
  cardText: { fontSize: 22, fontWeight: '600', color: '#333', textAlign: 'center', lineHeight: 30 },
  tapHint: { position: 'absolute', bottom: 20, fontSize: 12, color: '#999' },

  footer: { flexDirection: 'row', justifyContent: 'space-between', padding: 30, paddingBottom: 40 },
  navBtn: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  navText: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 8, color: '#333' },
  disabledBtn: { opacity: 0.5 },
  disabledText: { color: '#ccc' },

  backButton: { marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#fff', borderRadius: 20 },
  backButtonText: { color: '#333', fontWeight: 'bold' }
});
