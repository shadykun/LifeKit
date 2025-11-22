import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform 
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ApiService } from '../services/ApiService';

export default function QuizScreen({ navigation, route }) {
  const { moduleId, moduleTitle } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [screenState, setScreenState] = useState('loading'); 
  const [playableItems, setPlayableItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  useEffect(() => {
    const initQuiz = async () => {
      setLoading(true);
      try {
        console.log(`[Quiz] Caut test pentru Modul ID: ${moduleId}`);

        // PAS 1: Luăm toate Quiz-urile
        const allQuizzes = await ApiService.getQuizzes();
        
        // --- FIX PENTRU ID CURS ---
        // Încercăm să găsim quiz-ul asociat acestui modul.
        // Prioritate 1: Căutăm după câmpul explicit 'course_id'
        // Prioritate 2: Căutăm după 'id' (Presupunem Quiz ID == Course ID)
        
        let targetQuiz = allQuizzes.find(q => String(q.course_id) === String(moduleId));
        
        if (!targetQuiz) {
           console.log("Nu am găsit după course_id. Încerc după ID direct...");
           targetQuiz = allQuizzes.find(q => String(q.id) === String(moduleId));
        }

        if (!targetQuiz) {
          console.log(`[Quiz] Niciun test găsit pentru ID ${moduleId}`);
          if(Platform.OS !== 'web') Alert.alert("Info", "Nu există un test pentru acest curs.");
          setScreenState('error');
          setLoading(false);
          return;
        }

        console.log(`[Quiz] Test identificat: ${targetQuiz.title} (ID: ${targetQuiz.id})`);

        // PAS 2: Luăm întrebările
        const allQuestions = await ApiService.getQuestions();
        
        // Filtrăm întrebările pentru acest quiz
        const quizQuestions = allQuestions.filter(q => String(q.quiz_id) === String(targetQuiz.id));

        if (quizQuestions.length === 0) {
          console.log(`[Quiz] Testul ID ${targetQuiz.id} nu are întrebări.`);
          setScreenState('error');
          setLoading(false);
          return;
        }

        // PAS 3: Formatăm datele
        const formatted = quizQuestions.map((q, index) => {
          let options = [];
          const raw = q.options || q.choices || q.answers;
          
          // Parsare opțiuni
          if (Array.isArray(raw)) options = raw;
          else if (typeof raw === 'string') {
             try { options = JSON.parse(raw); } catch { options = raw.split(','); }
          } else {
             // Fallback: coloane separate
             options = [
               q.option_1, q.option_2, q.option_3, q.option_4,
               q.answer_a, q.answer_b, q.answer_c, q.answer_d
             ].filter(v => v && String(v).trim() !== "");
             
             if(options.length === 0) options = ["Adevărat", "Fals"];
          }

          // Răspuns corect
          const correct = q.correct_answer || q.correct_option || q.answer || q.correct;

          // Text Întrebare (Fallback robust)
          const qText = q.question_text || q.question || q.text || q.content || `Întrebarea ${index + 1}`;

          return {
            id: q.id,
            text: qText,
            options: options,
            correctAnswer: correct
          };
        });

        console.log(`[Quiz] ${formatted.length} întrebări încărcate.`);
        setPlayableItems(formatted);
        setScreenState('playing');

      } catch (error) {
        console.error("[Quiz Error]", error);
        setScreenState('error');
      } finally {
        setLoading(false);
      }
    };

    initQuiz();
  }, [moduleId]);

  const handleAnswer = (option) => {
    if (isAnswerChecked) return;
    setSelectedOptionId(option);
    setIsAnswerChecked(true);
    const currentQ = playableItems[currentIndex];
    
    // Comparare flexibilă (trim & lowercase)
    if (String(option).trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase()) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    setIsAnswerChecked(false);
    setSelectedOptionId(null);
    if (currentIndex < playableItems.length - 1) setCurrentIndex(prev => prev + 1);
    else setScreenState('result');
  };

  const restartQuiz = () => {
    setCurrentIndex(0); setScore(0); setIsAnswerChecked(false); setSelectedOptionId(null); setScreenState('playing');
  };

  const renderGame = () => {
    const item = playableItems[currentIndex];
    const progress = ((currentIndex + 1) / playableItems.length) * 100;

    return (
      <ScrollView contentContainerStyle={styles.gameContainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Întrebarea {currentIndex + 1} / {playableItems.length}</Text>
          <View style={styles.progressBarBg}><View style={[styles.progressBarFill, {width: `${progress}%`}]} /></View>
        </View>
        <View style={styles.questionBox}><Text style={styles.questionText}>{item.text}</Text></View>
        
        {item.options.map((opt, idx) => {
          const isSelected = selectedOptionId === opt;
          const isCorrect = String(opt).trim().toLowerCase() === String(item.correctAnswer).trim().toLowerCase();
          let style = styles.optionBtn;
          let icon = "ellipse-outline"; let color = "#666"; let txtStyle = styles.optionText;

          if (isAnswerChecked) {
            if (isCorrect) { style = styles.correctBtn; icon = "checkmark-circle"; color = "#fff"; txtStyle = styles.whiteText; }
            else if (isSelected) { style = styles.wrongBtn; icon = "close-circle"; color = "#fff"; txtStyle = styles.whiteText; }
          } else if (isSelected) { style = styles.selectedBtn; icon = "radio-button-on"; color = "#007AFF"; }

          return (
            <TouchableOpacity key={idx} style={style} onPress={() => handleAnswer(opt)} disabled={isAnswerChecked}>
              <Text style={txtStyle}>{opt}</Text>
              <Ionicons name={icon} size={24} color={color} />
            </TouchableOpacity>
          );
        })}

        {isAnswerChecked && (
          <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
            <Text style={styles.nextButtonText}>{currentIndex === playableItems.length - 1 ? "Rezultat" : "Următoarea"}</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  const renderResult = () => {
    const isPass = (score / playableItems.length) >= 0.5;
    return (
      <View style={styles.resultContainer}>
        <Ionicons name={isPass ? "trophy" : "book-outline"} size={100} color={isPass ? "#FFD700" : "#90A4AE"} />
        <Text style={styles.resultTitle}>{isPass ? "Felicitări!" : "Mai încearcă!"}</Text>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Scor</Text>
          <Text style={[styles.scoreVal, {color: isPass ? '#4CAF50' : '#E53935'}]}>{score} / {playableItems.length}</Text>
        </View>
        <Text style={styles.resultMsg}>{isPass ? "Ai finalizat testul!" : "Reia materialele și încearcă din nou."}</Text>
        <TouchableOpacity style={styles.restartBtn} onPress={restartQuiz}><Text style={styles.restartText}>Reia</Text></TouchableOpacity>
        <TouchableOpacity style={styles.exitBtn} onPress={() => navigation.goBack()}><Text style={styles.exitText}>Ieși</Text></TouchableOpacity>
      </View>
    );
  };

  const renderError = () => (
    <View style={styles.centerContainer}>
      <Ionicons name="construct-outline" size={60} color="#ccc" />
      <Text style={{marginTop: 10, color: '#666', textAlign: 'center'}}>Nu am găsit date valide.</Text>
      <TouchableOpacity style={styles.exitBtn} onPress={() => navigation.goBack()}><Text style={styles.exitText}>Înapoi</Text></TouchableOpacity>
    </View>
  );

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007AFF" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webWrapper}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="close" size={28} color="#333"/></TouchableOpacity>
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15 },
  navTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  gameContainer: { padding: 20, paddingBottom: 40 },
  progressContainer: { marginBottom: 20 },
  progressText: { fontSize: 14, color: '#666', marginBottom: 5 },
  progressBarBg: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4 },
  progressBarFill: { height: 8, backgroundColor: '#007AFF', borderRadius: 4 },
  questionBox: { backgroundColor: '#fff', padding: 25, borderRadius: 16, marginBottom: 25, elevation: 3 },
  questionText: { fontSize: 18, fontWeight: '600', color: '#333', textAlign: 'center' },
  optionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 18, borderRadius: 12, marginBottom: 12, borderWidth: 2, borderColor: '#E0E0E0', ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}) },
  selectedBtn: { borderColor: '#007AFF', backgroundColor: '#F0F8FF' },
  correctBtn: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  wrongBtn: { backgroundColor: '#FF5252', borderColor: '#FF5252' },
  optionText: { fontSize: 16, color: '#333' },
  whiteText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  nextButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007AFF', padding: 16, borderRadius: 30, marginTop: 20, ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}) },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
  resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  resultTitle: { fontSize: 32, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 },
  scoreBox: { backgroundColor: '#fff', paddingVertical: 20, paddingHorizontal: 50, borderRadius: 20, alignItems: 'center', elevation: 3, marginVertical: 25 },
  scoreLabel: { fontSize: 14, color: '#888', textTransform: 'uppercase' },
  scoreVal: { fontSize: 40, fontWeight: 'bold', marginTop: 5 },
  restartBtn: { backgroundColor: '#007AFF', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, marginBottom: 15, ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}) },
  restartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  exitBtn: { padding: 15, ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}) },
  exitText: { color: '#666', fontSize: 16, textDecorationLine: 'underline' },
});