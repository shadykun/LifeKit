import React, {useState} from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QUIZ_DATA = [
  {
    id: 'q1',
    question: 'Ce trebuie să faci mai întâi când găsești o persoană inconștientă?',
    options: [
      { id: 'a', text: 'Să o miști imediat într-un loc mai sigur', isCorrect: false },
      { id: 'b', text: 'Să verifici răspunsul și respirația', isCorrect: true },
      { id: 'c', text: 'Să îi dai apă imediat', isCorrect: false },
    ],
    explanation: 'Primul pas este să verifici răspunsul și respirația pentru a decide ce urmează (apel 112, CPR etc.).'
  },
  {
    id: 'q2',
    question: 'Cum verifici respirația corect?',
    options: [
      { id: 'a', text: 'Pune urechea aproape de gură/ nas și urmărește pieptul', isCorrect: true },
      { id: 'b', text: 'Ridici brațul pacientului', isCorrect: false },
      { id: 'c', text: 'Îi dai palme puternice', isCorrect: false },
    ],
    explanation: 'Fii atent la sunete de respirație, mișcarea pieptului și simte suflul la ureche.'
  },
  {
    id: 'q3',
    question: 'Ce facem dacă detectăm o hemoragie puternică?',
    options: [
      { id: 'a', text: 'Aplicăm presiune directă pe rană', isCorrect: true },
      { id: 'b', text: 'Ridicăm hainele pacientului', isCorrect: false },
      { id: 'c', text: 'Așteptăm o ambulanță fără a interveni', isCorrect: false },
    ],
    explanation: 'Aplicarea presiunii directe ajută la oprirea sângerării; apoi ridicarea membrului dacă este posibil.'
  }
];

export default function QuizScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const current = QUIZ_DATA[currentIndex];

  const onSelect = (option) => {
    if (answered) return;
    setSelectedId(option.id);
    setAnswered(true);
    if (option.isCorrect) setScore(prev => prev + 1);
  };

  const onNext = () => {
    const next = currentIndex + 1;
    setSelectedId(null);
    setAnswered(false);
    if (next < QUIZ_DATA.length) {
      setCurrentIndex(next);
    } else {
      setShowResult(true);
    }
  };

  const onRetry = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedId(null);
    setAnswered(false);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.containerCenter}>
          <Ionicons name="checkmark-circle-outline" size={64} color="#007AFF" />
          <Text style={styles.resultTitle}>Rezultat</Text>
          <Text style={styles.resultScore}>{score} / {QUIZ_DATA.length}</Text>

          <View style={styles.resultButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={onRetry}>
              <Text style={styles.primaryButtonText}>Repetă</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostButton} onPress={() => navigation.goBack()}>
              <Text style={styles.ghostButtonText}>Înapoi la Module</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.counter}>Întrebare {currentIndex + 1} / {QUIZ_DATA.length}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.question}>{current.question}</Text>

          <View style={styles.options}>
            {current.options.map(opt => {
              const isSelected = selectedId === opt.id;
              const correct = opt.isCorrect;

              // determine style
              let optionStyle = styles.option;
              let optionTextStyle = styles.optionText;

              if (answered) {
                if (isSelected && correct) {
                  optionStyle = {...optionStyle, ...styles.optionCorrect};
                  optionTextStyle = {...optionTextStyle, color: '#fff'};
                } else if (isSelected && !correct) {
                  optionStyle = {...optionStyle, ...styles.optionWrong};
                  optionTextStyle = {...optionTextStyle, color: '#fff'};
                } else if (!isSelected && correct) {
                  // show correct answer when a wrong was selected
                  optionStyle = {...optionStyle, ...styles.optionCorrectOutline};
                }
              }

              return (
                <TouchableOpacity
                  key={opt.id}
                  style={optionStyle}
                  onPress={() => onSelect(opt)}
                >
                  <Text style={optionTextStyle}>{opt.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {answered && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationText}>{current.explanation}</Text>
            </View>
          )}

          {answered && (
            <TouchableOpacity style={styles.nextButton} onPress={onNext}>
              <Text style={styles.nextButtonText}>Următoarea</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  container: { flex: 1, padding: 16 },
  header: { paddingVertical: 8 },
  counter: { color: '#333', fontSize: 14 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    flex: 1
  },
  question: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 16 },
  options: { marginTop: 8 },
  option: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E6EEF8',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: { color: '#333', fontSize: 15 },
  optionCorrect: { backgroundColor: '#2ECC71', borderColor: '#2ECC71' },
  optionWrong: { backgroundColor: '#E74C3C', borderColor: '#E74C3C' },
  optionCorrectOutline: { borderColor: '#2ECC71', borderWidth: 2 },
  explanationBox: { marginTop: 12, padding: 12, backgroundColor: '#F0F6FF', borderRadius: 8 },
  explanationText: { color: '#333' },
  nextButton: { marginTop: 16, backgroundColor: '#007AFF', padding: 14, borderRadius: 10, alignItems: 'center' },
  nextButtonText: { color: '#fff', fontWeight: '700' },
  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' },
  resultTitle: { fontSize: 22, fontWeight: '700', color: '#333', marginTop: 12 },
  resultScore: { fontSize: 36, fontWeight: '800', color: '#007AFF', marginVertical: 12 },
  resultButtons: { flexDirection: 'row', marginTop: 20 },
  primaryButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 10, marginRight: 8 },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  ghostButton: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#007AFF' },
  ghostButtonText: { color: '#007AFF', fontWeight: '700' }
});
