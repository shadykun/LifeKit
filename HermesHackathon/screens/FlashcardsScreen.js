import React, { useRef, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FLASHCARDS = [
  { id: 'f1', frontText: 'Cum aplici presiune pe o rană?', backText: 'Aplică presiune directă cu un material curat și menține presiunea.' },
  { id: 'f2', frontText: 'Semnele unui infarct', backText: 'Durere în piept, dificultate la respirație, transpirații reci, senzație de greață.' },
  { id: 'f3', frontText: 'Poziția de siguranță', backText: 'Întoarce persoana pe o parte, sprijină capul, verifică respirația.' }
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(360, width - 40);

export default function FlashcardsScreen() {
  const [index, setIndex] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const flipCard = () => {
    const toValue = flipped ? 0 : 180;
    Animated.spring(animatedValue, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
  };

  const rotateY = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg']
  });

  const rotateYBack = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg']
  });

  const goNext = () => {
    if (index < FLASHCARDS.length - 1) {
      setIndex(index + 1);
      // reset flip
      Animated.timing(animatedValue, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      setFlipped(false);
    }
  };

  const goPrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      Animated.timing(animatedValue, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      setFlipped(false);
    }
  };

  const card = FLASHCARDS[index];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.progressText}>Card {index + 1} / {FLASHCARDS.length}</Text>

        <View style={styles.cardContainer}>
          <TouchableOpacity activeOpacity={0.9} onPress={flipCard}>
            <View>
              <Animated.View style={[styles.card, { transform: [{ rotateY }], zIndex: flipped ? 0 : 1 }] }>
                <Text style={styles.label}>Front</Text>
                <Text style={styles.cardText}>{card.frontText}</Text>
              </Animated.View>

              <Animated.View style={[styles.card, styles.cardBack, { transform: [{ rotateY: rotateYBack }], position: 'absolute', top: 0 }] }>
                <Text style={styles.label}>Back</Text>
                <Text style={styles.cardText}>{card.backText}</Text>
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={[styles.controlButton, index === 0 && styles.controlDisabled]} onPress={goPrev} disabled={index === 0}>
            <Ionicons name="arrow-back" size={20} color={index === 0 ? '#999' : '#007AFF'} />
            <Text style={[styles.controlText, index === 0 && { color: '#999' }]}>Anterior</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlButton, index === FLASHCARDS.length - 1 && styles.controlDisabled]} onPress={goNext} disabled={index === FLASHCARDS.length - 1}>
            <Text style={[styles.controlText, index === FLASHCARDS.length - 1 && { color: '#999' }]}>Următor</Text>
            <Ionicons name="arrow-forward" size={20} color={index === FLASHCARDS.length - 1 ? '#999' : '#007AFF'} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  container: { flex: 1, alignItems: 'center', padding: 20 },
  progressText: { color: '#333', alignSelf: 'flex-start', marginBottom: 12 },
  cardContainer: { width: CARD_WIDTH, height: 320, justifyContent: 'center', alignItems: 'center' },
  card: {
    width: CARD_WIDTH,
    height: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    backfaceVisibility: 'hidden'
  },
  cardBack: {
    backgroundColor: '#F0F6FF'
  },
  label: { fontSize: 12, color: '#888', marginBottom: 8 },
  cardText: { fontSize: 20, color: '#333', textAlign: 'center' },
  controls: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
  controlButton: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  controlText: { color: '#007AFF', marginHorizontal: 8, fontWeight: '600' },
  controlDisabled: { opacity: 0.6 }
});
