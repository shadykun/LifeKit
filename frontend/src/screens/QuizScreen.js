import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import LoadingView from '../components/LoadingView';
import { ApiService } from '../services/api';
import { webPointer } from '../utils/styles';

const PASS_THRESHOLD = 0.5;

const sameId = (a, b) => String(a) === String(b);

// API question -> { id, text, options, correctAnswer }. Empty answer slots are dropped
// and the 1-based `correct_answer` index is resolved to the answer text.
const toPlayableQuestion = (question) => {
  const options = [question.answer1_text, question.answer2_text, question.answer3_text]
    .filter(option => option && String(option).trim() !== "");
  const correctIndex = question.correct_answer - 1;
  const hasValidIndex = typeof question.correct_answer === 'number' && correctIndex >= 0 && correctIndex < options.length;

  return {
    id: question.id,
    text: question.question_text || "Întrebare fără text",
    options,
    correctAnswer: options[hasValidIndex ? correctIndex : 0],
  };
};

// Returns the playable questions of the module's quiz, or null when the module has no quiz.
const loadQuizQuestions = async (moduleId) => {
  const quizzes = await ApiService.getQuizzes();
  // Prefer a quiz linked to the course; fall back to the quiz sharing the module's id.
  const quiz =
    quizzes.find(q => sameId(q.course_id, moduleId)) ||
    quizzes.find(q => sameId(q.id, moduleId));
  if (!quiz) return null;

  const questions = await ApiService.getQuestions();
  return questions.filter(q => sameId(q.quiz_id, quiz.id)).map(toPlayableQuestion);
};

export default function QuizScreen({ navigation, route }) {
  const { moduleId, moduleTitle } = route.params || {};

  const [screenState, setScreenState] = useState('loading'); // 'loading' | 'playing' | 'result' | 'error'
  const [playableItems, setPlayableItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  useEffect(() => {
    const initQuiz = async () => {
      setScreenState('loading');
      try {
        const questions = await loadQuizQuestions(moduleId);

        if (!questions) {
          if (Platform.OS !== 'web') Alert.alert("Info", "Nu există un test configurat pentru acest modul.");
          setScreenState('error');
          return;
        }
        if (questions.length === 0) {
          setScreenState('error');
          return;
        }

        setPlayableItems(questions);
        setCurrentIndex(0);
        setScore(0);
        setScreenState('playing');
      } catch (error) {
        console.error("[Quiz Error]", error);
        setScreenState('error');
      }
    };

    initQuiz();
  }, [moduleId]);

  const isCorrectOption = (option, question) =>
    String(option).trim() === String(question.correctAnswer).trim();

  const handleAnswer = (option) => {
    if (isAnswerChecked) return;
    setSelectedOption(option);
    setIsAnswerChecked(true);

    if (isCorrectOption(option, playableItems[currentIndex])) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    setIsAnswerChecked(false);
    setSelectedOption(null);
    if (currentIndex < playableItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setScreenState('result');
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsAnswerChecked(false);
    setSelectedOption(null);
    setScreenState('playing');
  };

  const renderGame = () => {
    const item = playableItems[currentIndex];
    const progress = ((currentIndex + 1) / playableItems.length) * 100;

    return (
      <ScrollView contentContainerStyle={styles.gameContainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Întrebarea {currentIndex + 1} din {playableItems.length}
          </Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{item.text}</Text>
        </View>

        {item.options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          const isCorrectAnswer = isCorrectOption(opt, item);

          let additionalStyle = {};
          let iconName = "ellipse-outline";
          let iconColor = "#A0A0A0";
          let textStyle = styles.optionText;

          if (isAnswerChecked) {
            // After answering: highlight the correct option and a wrong pick, fade the rest.
            if (isCorrectAnswer) {
              additionalStyle = styles.correctBtn;
              iconName = "checkmark-circle";
              iconColor = "#fff";
              textStyle = styles.whiteText;
            } else if (isSelected) {
              additionalStyle = styles.wrongBtn;
              iconName = "close-circle";
              iconColor = "#fff";
              textStyle = styles.whiteText;
            } else {
              additionalStyle = { opacity: 0.6 };
            }
          } else if (isSelected) {
            additionalStyle = styles.selectedBtn;
            iconName = "radio-button-on";
            iconColor = "#007AFF";
            textStyle = styles.selectedText;
          }

          return (
            <TouchableOpacity
              key={idx}
              style={[styles.optionBtn, additionalStyle]}
              onPress={() => handleAnswer(opt)}
              disabled={isAnswerChecked}
              activeOpacity={0.8}
            >
              <Text style={textStyle}>{opt}</Text>
              <Ionicons name={iconName} size={24} color={iconColor} />
            </TouchableOpacity>
          );
        })}

        {isAnswerChecked && (
          <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
            <Text style={styles.nextButtonText}>
              {currentIndex === playableItems.length - 1 ? "Vezi Rezultatul" : "Următoarea Întrebare"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  const renderResult = () => {
    const percentage = playableItems.length > 0 ? (score / playableItems.length) : 0;
    const isPass = percentage >= PASS_THRESHOLD;

    return (
      <View style={styles.resultContainer}>
        <Ionicons
          name={isPass ? "trophy" : "book-outline"}
          size={100}
          color={isPass ? "#FFD700" : "#90A4AE"}
        />
        <Text style={styles.resultTitle}>{isPass ? "Felicitări!" : "Mai încearcă!"}</Text>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Scor Final</Text>
          <Text style={[styles.scoreVal, {color: isPass ? '#4CAF50' : '#E53935'}]}>
            {score} / {playableItems.length}
          </Text>
        </View>
        <TouchableOpacity style={styles.restartBtn} onPress={restartQuiz}>
          <Text style={styles.restartText}>Reia Testul</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.exitText}>Ieși</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderError = () => (
    <View style={styles.centerContainer}>
      <Ionicons name="construct-outline" size={60} color="#ccc" />
      <Text style={{marginTop: 10, color: '#666'}}>Nu am găsit date valide pentru test.</Text>
      <TouchableOpacity style={styles.exitBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.exitText}>Înapoi</Text>
      </TouchableOpacity>
    </View>
  );

  if (screenState === 'loading') {
    return <LoadingView />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webWrapper}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color="#333"/>
          </TouchableOpacity>
          <Text style={styles.navTitle}>Quiz: {moduleTitle}</Text>
          <View style={{width: 28}} />
        </View>
        {screenState === 'error' && renderError()}
        {screenState === 'playing' && renderGame()}
        {screenState === 'result' && renderResult()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  webWrapper: { flex: 1, alignSelf: 'center', width: '100%', maxWidth: 600, backgroundColor: Platform.OS === 'web' ? '#fff' : 'transparent' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },

  // Navigation
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  navTitle: { fontSize: 17, fontWeight: '700', color: '#333' },

  // Game Container
  gameContainer: { padding: 20, paddingBottom: 40 },

  // Progress
  progressContainer: { marginBottom: 25 },
  progressText: { fontSize: 13, color: '#888', marginBottom: 8, fontWeight: '600' },
  progressBarBg: { height: 6, backgroundColor: '#EEF0F3', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: 6, backgroundColor: '#4CD964', borderRadius: 3 },

  // Question Box
  questionBox: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  questionText: { fontSize: 19, fontWeight: '700', color: '#2D3436', textAlign: 'center', lineHeight: 28 },

  // Option buttons
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#EAECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    ...webPointer,
    ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' } : {}),
  },

  // Option states (colors only)
  selectedBtn: {
    borderColor: '#007AFF',
    backgroundColor: '#F2F8FF'
  },
  correctBtn: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50'
  },
  wrongBtn: {
    backgroundColor: '#FF5252',
    borderColor: '#FF5252'
  },

  // Text Styles
  optionText: { fontSize: 16, color: '#555', flex: 1, marginRight: 10, fontWeight: '500' },
  selectedText: { fontSize: 16, color: '#007AFF', flex: 1, marginRight: 10, fontWeight: '600' },
  whiteText: { fontSize: 16, color: '#fff', flex: 1, marginRight: 10, fontWeight: '700' },

  // Next Button
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D3436',
    padding: 18,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 8 },

  // Results
  resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  resultTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginTop: 20, marginBottom: 10 },
  scoreBox: { backgroundColor: '#fff', paddingVertical: 25, paddingHorizontal: 60, borderRadius: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10, marginVertical: 30 },
  scoreLabel: { fontSize: 13, color: '#999', fontWeight: '700', letterSpacing: 1 },
  scoreVal: { fontSize: 48, fontWeight: '800', marginTop: 5 },
  restartBtn: { backgroundColor: '#007AFF', paddingVertical: 16, paddingHorizontal: 30, borderRadius: 14, width: '100%', alignItems: 'center', marginBottom: 15 },
  restartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  exitBtn: { padding: 15 },
  exitText: { color: '#888', fontSize: 15, fontWeight: '600' },
});
