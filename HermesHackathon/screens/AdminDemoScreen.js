import React, { useState, useEffect } from 'react';
import { 
  ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform, Modal, Switch, FlatList, SafeAreaView
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
// Presupunem că ApiService este importat corect. 
// Dacă fisierul se numește ApiServer.js, ajustează importul: import { ApiService } from './ApiServer';
import { ApiService } from '../services/ApiService'; 

const BASE_URL = `http://ec2-63-178-67-11.eu-central-1.compute.amazonaws.com:8000`; 
const headers = { 'Content-Type': 'application/json' };

// --- DEFINIRE SCHEME ---
const SCHEMAS = {
  course: {
    label: 'Cursuri (Courses)',
    endpoint: '/courses/',
    fields: [
      { name: 'title', label: 'Titlu Curs', placeholder: 'Ex: Primul ajutor hemoragii' },
      { name: 'description', label: 'Descriere', placeholder: 'Proceduri esențiale...', multiline: true },
      { name: 'parenting', label: 'Este modul de Parenting?', type: 'boolean', initialValue: false },
    ]
  },
  quiz: {
    label: 'Quiz-uri',
    endpoint: '/quizzes/',
    fields: [
      { name: 'course_id', label: 'ID Curs', placeholder: 'Ex: 49', keyboardType: 'numeric' },
      { name: 'title', label: 'Titlu Test', placeholder: 'Ex: Verificare rapidă' },
    ]
  },
  question: {
    label: 'Întrebări (Questions)',
    endpoint: '/questions/',
    fields: [
      { name: 'quiz_id', label: 'ID Quiz', placeholder: 'Ex: 16', keyboardType: 'numeric' },
      { name: 'question_text', label: 'Enunț Întrebare', placeholder: 'Care este prima acțiune...?', multiline: true },
      { name: 'answer1_text', label: 'Varianta 1', placeholder: 'Răspuns A' },
      { name: 'answer2_text', label: 'Varianta 2', placeholder: 'Răspuns B' },
      { name: 'answer3_text', label: 'Varianta 3', placeholder: 'Răspuns C' },
      { name: 'correct_answer', label: 'Index Corect (1-3)', placeholder: '1', keyboardType: 'numeric' },
      { name: 'answer_text', label: 'Explicație / Feedback', placeholder: 'Explicatie...', multiline: true },
    ]
  },
  flashcard: {
    label: 'Flashcards',
    endpoint: '/flashcards/',
    fields: [
      { name: 'course_id', label: 'ID Curs', placeholder: 'Ex: 49', keyboardType: 'numeric' },
      { name: 'front_text', label: 'Față', placeholder: 'Întrebare...' },
      { name: 'back_text', label: 'Spate', placeholder: 'Răspuns...', multiline: true }
    ]
  },
  text: {
    label: 'Texte / Lecții',
    endpoint: '/texts/',
    fields: [
      { name: 'course_id', label: 'ID Curs', placeholder: 'Ex: 49', keyboardType: 'numeric' },
      { name: 'body_content', label: 'Conținut Lecție', placeholder: 'Text...', multiline: true }
    ]
  },
  image: {
    label: 'Imagini',
    endpoint: '/images/',
    fields: [
      { name: 'course_id', label: 'ID Curs', placeholder: 'Ex: 49', keyboardType: 'numeric' },
      { name: 'url', label: 'URL Imagine', placeholder: 'https://...' },
      { name: 'alt_text', label: 'Descriere', placeholder: 'Descriere...' },
      { name: 'text_id', label: 'ID Text (Opțional)', placeholder: 'Ex: 49', keyboardType: 'numeric' }
    ]
  },
  video: {
    label: 'Video',
    endpoint: '/videos/',
    fields: [
      { name: 'course_id', label: 'ID Curs', placeholder: 'Ex: 49', keyboardType: 'numeric' },
      { name: 'url', label: 'URL Video', placeholder: 'https://...' },
      { name: 'duration', label: 'Durată (sec)', placeholder: '480', keyboardType: 'numeric' }
    ]
  }
};

export default function AdminDemoScreen() {
  // State pentru Tab-uri: 'form' sau 'list'
  const [activeTab, setActiveTab] = useState('form');
  
  // State pentru Formular
  const [selectedType, setSelectedType] = useState('course');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // State pentru Listă Cursuri
  const [courses, setCourses] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // --- LOGICA PENTRU LISTA DE CURSURI ---
  const fetchCourses = async () => {
    setLoadingList(true);
    try {
      // Folosim ApiService așa cum ai menționat
      const data = await ApiService.getCourses();
      // Verificăm dacă ApiService returnează array-ul direct sau un obiect { results: ... }
      const list = Array.isArray(data) ? data : (data.results || []);
      setCourses(list);
    } catch (error) {
      Alert.alert("Eroare", "Nu am putut încărca cursurile: " + error.message);
    } finally {
      setLoadingList(false);
    }
  };

  // Încărcăm cursurile când intrăm pe tab-ul de listă
  useEffect(() => {
    if (activeTab === 'list') {
      fetchCourses();
    }
  }, [activeTab]);

  const handleDeleteCourse = (id) => {
    Alert.alert(
      "Ștergere Curs",
      "Sigur vrei să ștergi acest curs? \n\nATENȚIE: Se vor șterge automat toate lecțiile, întrebările și imaginile asociate (Cascade Delete).",
      [
        { text: "Anulează", style: "cancel" },
        { 
          text: "Șterge Definitiv", 
          style: "destructive",
          onPress: async () => {
            try {
              // Facem call direct de delete, presupunând că backend-ul e RESTful standard
              const response = await fetch(`${BASE_URL}/courses/${id}`, {
                method: 'DELETE',
                headers: headers
              });
              
              if (!response.ok) throw new Error("Eroare la ștergere");
              
              Alert.alert("Succes", "Cursul a fost șters.");
              fetchCourses(); // Reîmprospătăm lista
            } catch (error) {
              Alert.alert("Eroare", error.message);
            }
          }
        }
      ]
    );
  };

  // --- LOGICA FORMULAR ---
  const handleTypeChange = (type) => {
    setSelectedType(type);
    setFormData({});
    setShowMenu(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const schema = SCHEMAS[selectedType];
    const payload = { ...formData };
    
    schema.fields.forEach(f => {
      if (f.keyboardType === 'numeric' && payload[f.name]) {
        payload[f.name] = Number(payload[f.name]);
      }
      if (f.type === 'boolean') {
        payload[f.name] = payload[f.name] !== undefined ? payload[f.name] : f.initialValue;
      }
    });

    try {
      console.log(`Sending to ${BASE_URL}${schema.endpoint}`, payload);
      const response = await fetch(`${BASE_URL}${schema.endpoint}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
      const json = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(json) || "Eroare server");
      Alert.alert("Succes!", `${schema.label} a fost adăugat (ID: ${json.id || 'Nou'}).`);
    } catch (error) {
      console.error(error);
      Alert.alert("Eroare", error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentSchema = SCHEMAS[selectedType];

  // --- RENDER ELEMENT LISTĂ ---
  const renderCourseItem = ({ item }) => (
    <View style={styles.courseCard}>
      <View style={{flex: 1}}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ID: {item.id}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={22} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Gestionează Baza de Date</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'form' && styles.activeTab]} 
          onPress={() => setActiveTab('form')}
        >
          <Ionicons name="add-circle-outline" size={20} color={activeTab === 'form' ? '#007AFF' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'form' && styles.activeTabText]}>Adaugă</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'list' && styles.activeTab]} 
          onPress={() => setActiveTab('list')}
        >
          <Ionicons name="list-outline" size={20} color={activeTab === 'list' ? '#007AFF' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>Listă Cursuri</Text>
        </TouchableOpacity>
      </View>

      {/* --- VEDERE FORMULAR --- */}
      {activeTab === 'form' ? (
        <View style={{flex: 1}}>
          {/* Dropdown Selector */}
          <View style={styles.selectorContainer}>
            <Text style={styles.label}>Tip Conținut:</Text>
            <TouchableOpacity style={styles.selectorBtn} onPress={() => setShowMenu(true)}>
              <Text style={styles.selectorText}>{currentSchema.label}</Text>
              <Ionicons name="chevron-down" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} contentContainerStyle={{paddingBottom: 50}}>
            {currentSchema.fields.map((field) => (
              <View key={field.name} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{field.label}</Text>
                {field.type === 'boolean' ? (
                  <View style={styles.switchContainer}>
                    <Text style={{color: '#666'}}>{formData[field.name] ? 'DA' : 'NU'}</Text>
                    <Switch
                      value={formData[field.name] || field.initialValue}
                      onValueChange={(val) => handleInputChange(field.name, val)}
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={formData[field.name] ? "#007AFF" : "#f4f3f4"}
                    />
                  </View>
                ) : (
                  <TextInput
                    style={[styles.input, field.multiline && styles.textArea]}
                    placeholder={field.placeholder}
                    placeholderTextColor="#A0A0A0"
                    value={formData[field.name] ? String(formData[field.name]) : ''}
                    onChangeText={(text) => handleInputChange(field.name, text)}
                    keyboardType={field.keyboardType || 'default'}
                    multiline={field.multiline}
                    numberOfLines={field.multiline ? 3 : 1}
                  />
                )}
              </View>
            ))}
            <TouchableOpacity 
              style={[styles.submitBtn, loading && styles.disabledBtn]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>SALVEAZĂ</Text>}
            </TouchableOpacity>
            <View style={{height: 40}} />
          </ScrollView>
        </View>
      ) : (
        // --- VEDERE LISTĂ ---
        <View style={styles.listContainer}>
          {loadingList ? (
            <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 20}} />
          ) : (
            <FlatList
              data={courses}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCourseItem}
              contentContainerStyle={{padding: 20}}
              ListEmptyComponent={
                <Text style={{textAlign: 'center', color: '#999', marginTop: 20}}>Nu există cursuri.</Text>
              }
            />
          )}
        </View>
      )}

      {/* Modal Meniu */}
      <Modal visible={showMenu} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowMenu(false)} activeOpacity={1}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selectează Tabela</Text>
            <ScrollView>
              {Object.keys(SCHEMAS).map(key => (
                <TouchableOpacity 
                  key={key} 
                  style={styles.modalItem} 
                  onPress={() => handleTypeChange(key)}
                >
                  <Text style={[styles.modalItemText, selectedType === key && {color: '#007AFF', fontWeight: 'bold'}]}>
                    {SCHEMAS[key].label}
                  </Text>
                  {selectedType === key && <Ionicons name="checkmark" size={20} color="#007AFF"/>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowMenu(false)}>
              <Text style={styles.closeModalText}>Închide</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F8' },
  header: { padding: 20, paddingTop: Platform.OS === 'android' ? 40 : 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E5E5' },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  
  // Tabs
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, margin: 15, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: {width:0, height:2} },
  tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8 },
  activeTab: { backgroundColor: '#E3F2FD' },
  tabText: { marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#666' },
  activeTabText: { color: '#007AFF' },

  // Selectors & Form
  selectorContainer: { paddingHorizontal: 20, paddingBottom: 10 },
  label: { fontSize: 13, fontWeight: '700', color: '#888', marginBottom: 8, textTransform: 'uppercase' },
  selectorBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#D1D1D6' },
  selectorText: { fontSize: 16, fontWeight: '600', color: '#333' },
  formContainer: { flex: 1, padding: 20 },
  inputGroup: { marginBottom: 18 },
  inputLabel: { fontSize: 14, color: '#333', marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: '#fff', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0', fontSize: 16, color: '#333' },
  textArea: { height: 80, textAlignVertical: 'top' },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  submitBtn: { backgroundColor: '#007AFF', padding: 18, borderRadius: 14, alignItems: 'center', marginTop: 15 },
  disabledBtn: { backgroundColor: '#B0B0B0' },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  // List Styles
  listContainer: { flex: 1, backgroundColor: '#F2F4F8' },
  courseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: {width:0, height:2}, shadowRadius: 4, elevation: 2 },
  courseTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  badge: { backgroundColor: '#E3F2FD', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 12, color: '#007AFF', fontWeight: 'bold' },
  deleteButton: { padding: 10, backgroundColor: '#FFF0F0', borderRadius: 10 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '70%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalItemText: { fontSize: 17, color: '#333' },
  closeModalBtn: { marginTop: 20, padding: 15, alignItems: 'center', backgroundColor: '#F2F2F7', borderRadius: 12 },
  closeModalText: { fontSize: 16, fontWeight: '600', color: '#333' }
});