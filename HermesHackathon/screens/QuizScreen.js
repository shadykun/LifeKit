import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal 
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ApiService } from '../services/ApiService';

export default function QuizScreen({ navigation, route }) {
  const { moduleId, moduleTitle } = route.params || {};

  // Stări Aplicație
  const [loading, setLoading] = useState(true);
  const [screenState, setScreenState] = useState('list'); // 'list', 'playing', 'result'
  
  // Date
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  
  // Stare Joc
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  // --- 1. ÎNCĂRCARE LISTĂ QUIZ-URI ---
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const allQuizzes = await ApiService.getQuizzes();
        
        // Filtrăm quiz-urile care aparțin acestui curs (moduleId)
        // Presupunem că modelul Quiz are 'course_id'
        const filtered = allQuizzes.filter(q => q.course_id == moduleId || !q.course_id);
        
        setAvailableQuizzes(filtered);
      } catch (error) {
        console.error("Eroare Quiz:", error);
        Alert.alert("Eroare", "Nu am putut încărca testele.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [moduleId]);

  // --- 2. PORNIRE QUIZ (Fetch Întrebări) ---
  const startQuiz = async (quiz) => {
    setLoading(true);
    try {
      // Backend-ul tău are /questions care returnează TOATE întrebările
      // Trebuie să le luăm pe toate și să le filtrăm după quiz.id
      const allQuestions = await ApiService.getQuestions();
      
      const quizQuestions = allQuestions.filter(q => q.quiz_id === quiz.id);

      if (quizQuestions.length === 0) {
        Alert.alert("Ups!", "Acest test nu are întrebări încă.");
        setLoading(false);
        return;
      }

      setCurrentQuestions(quizQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setScreenState('playing');
    } catch (error) {
      Alert.alert("Eroare", "Nu am putut descărca întrebările.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGICA DE JOC ---
  const handleAnswer = (option) => {
    if (isAnswerChecked) return; // Nu lăsa să răspundă de două ori

    setSelectedOption(option);
    setIsAnswerChecked(true);

    const currentQ = currentQuestions[currentQuestionIndex];
    
    // Verificăm dacă răspunsul e corect
    // Presupunem că modelul Question are 'correct_answer' și 'options' (care poate fi JSON string sau array)
    // Sau poate opțiunile sunt 'option_a', 'option_b' etc.
    // Aici adaptez pentru un caz generic: option === currentQ.correct_answer
    
    if (option === currentQ.correct_answer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    setIsAnswerChecked(false);
    setSelectedOption(null);

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setScreenState('result');
    }
  };

  const restartQuiz = () => {
    setScreenState('list');
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  // --- RENDER: LISTA DE TESTE ---
  const renderQuizList = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerBox}>
        <Ionicons name="school" size={50} color="#007AFF" />
        <Text style={styles.headerTitle}>Teste Disponibile</Text>
        <Text style={styles.headerSubtitle}>{moduleTitle || "Module"}</Text>
      </View>

      {availableQuizzes.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Nu există teste pentru acest modul.</Text>
        </View>
      ) : (
        availableQuizzes.map((quiz, index) => (
          <TouchableOpacity 
            key={quiz.id || index} 
            style={styles.quizCard}
            onPress={() => startQuiz(quiz)}
          >
            <View style={styles.quizIconBg}>
              <Ionicons name="checkbox-outline" size={28} color="#FFF" />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.quizTitle}>{quiz.title || `Testul ${index + 1}`}</Text>
              <Text style={styles.quizDesc}>{quiz.description || "Verifică-ți cunoștințele."}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );

  // --- RENDER: JOC (ÎNTREBARE) ---
  const renderGame = () => {
    const question = currentQuestions[currentQuestionIndex];
    
    // Parsăm opțiunile (dacă vin ca string din backend, ex: "A,B,C,D" sau JSON)
    // Aici fac un fallback simplu: dacă options e array îl folosesc, altfel îl fac array
    let options = [];
    if (Array.isArray(question.options)) {
      options = question.options;
    } else if (typeof question.options === 'string') {
      // Dacă e string JSON sau CSV, încearcă să parsezi
      try { options = JSON.parse(question.options); } 
      catch { options = question.options.split(','); }
    } else {
      // Fallback hardcodat dacă backend-ul nu trimite options
      options = ["Adevărat", "Fals", "Nu știu"]; 
    }

    return (
      <ScrollView contentContainerStyle={styles.gameContainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Întrebarea {currentQuestionIndex + 1} / {currentQuestions.length}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, {width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`}]} />
          </View>
        </View>

        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{question.text || question.content}</Text>
        </View>

        {options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt === question.correct_answer;
          
          let btnStyle = styles.optionBtn;
          let txtStyle = styles.optionText;
          let iconName = "ellipse-outline";
          let iconColor = "#666";

          if (isAnswerChecked) {
            if (isCorrect) {
              btnStyle = styles.correctBtn; // Verde pt răspunsul corect
              txtStyle = styles.whiteText;
              iconName = "checkmark-circle";
              iconColor = "#fff";
            } else if (isSelected) {
              btnStyle = styles.wrongBtn; // Roșu dacă ai ales greșit
              txtStyle = styles.whiteText;
              iconName = "close-circle";
              iconColor = "#fff";
            }
          } else if (isSelected) {
            btnStyle = styles.selectedBtn;
            iconName = "radio-button-on";
            iconColor = "#007AFF";
          }

          return (
            <TouchableOpacity 
              key={idx} 
              style={btnStyle} 
              onPress={() => handleAnswer(opt)}
              disabled={isAnswerChecked}
            >
              <Text style={txtStyle}>{opt}</Text>
              <Ionicons name={iconName} size={24} color={iconColor} />
            </TouchableOpacity>
          );
        })}

        {isAnswerChecked && (
          <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex === currentQuestions.length - 1 ? "Vezi Rezultat" : "Următoarea"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  // --- RENDER: REZULTAT ---
  const renderResult = () => {
    const percentage = Math.round((score / currentQuestions.length) * 100);
    const isPass = percentage >= 50;

    return (
      <View style={styles.resultContainer}>
        <Ionicons 
          name={isPass ? "trophy" : "book"} 
          size={100} 
          color={isPass ? "#FFD700" : "#90A4AE"} 
        />
        <Text style={styles.resultTitle}>{isPass ? "Felicitări!" : "Mai încearcă!"}</Text>
        
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Scorul Tău</Text>
          <Text style={[styles.scoreVal, {color: isPass ? '#4CAF50' : '#E53935'}]}>
            {score} / {currentQuestions.length}
          </Text>
        </View>

        <Text style={styles.resultMsg}>
          {isPass 
            ? "Ai demonstrat că stăpânești noțiunile acestui capitol."
            : "Îți recomandăm să revezi materialele de studiu și să revii."}
        </Text>

        <TouchableOpacity style={styles.restartBtn} onPress={restartQuiz}>
          <Text style={styles.restartText}>Înapoi la Teste</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // --- RENDER PRINCIPAL ---
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{marginTop: 10, color: '#666'}}>Se încarcă...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 10}}>
          <Ionicons name="close" size={28} color="#333"/>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Quiz</Text>
        <View style={{width: 40}} />
      </View>

      {screenState === 'list' && renderQuizList()}
      {screenState === 'playing' && renderGame()}
      {screenState === 'result' && renderResult()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 },
  navTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },

  // List Styles
  scrollContent: { padding: 20 },
  headerBox: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 10 },
  headerSubtitle: { fontSize: 16, color: '#666' },
  quizCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, 
    borderRadius: 16, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 
  },
  quizIconBg: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  quizTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  quizDesc: { fontSize: 13, color: '#666' },
  emptyBox: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#999', fontSize: 16 },

  // Game Styles
  gameContainer: { padding: 20 },
  progressContainer: { marginBottom: 20 },
  progressText: { fontSize: 14, color: '#666', marginBottom: 5 },
  progressBarBg: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4 },
  progressBarFill: { height: 8, backgroundColor: '#007AFF', borderRadius: 4 },
  
  questionBox: { backgroundColor: '#fff', padding: 25, borderRadius: 16, marginBottom: 25, elevation: 2 },
  questionText: { fontSize: 18, fontWeight: '600', color: '#333', textAlign: 'center', lineHeight: 26 },
  
  optionBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    backgroundColor: '#fff', padding: 18, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E0E0E0' 
  },
  selectedBtn: { borderColor: '#007AFF', backgroundColor: '#F0F8FF' },
  correctBtn: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  wrongBtn: { backgroundColor: '#E53935', borderColor: '#E53935' },
  
  optionText: { fontSize: 16, color: '#333' },
  whiteText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },

  nextButton: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    backgroundColor: '#007AFF', padding: 16, borderRadius: 30, marginTop: 20 
  },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },

  // Result Styles
  resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  resultTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 },
  scoreBox: { backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 16, alignItems: 'center', elevation: 2, marginVertical: 20 },
  scoreLabel: { fontSize: 14, color: '#888', textTransform: 'uppercase' },
  scoreVal: { fontSize: 32, fontWeight: 'bold', marginTop: 5 },
  resultMsg: { textAlign: 'center', color: '#666', fontSize: 16, paddingHorizontal: 20, marginBottom: 40, lineHeight: 24 },
  restartBtn: { backgroundColor: '#007AFF', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30 },
  restartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});