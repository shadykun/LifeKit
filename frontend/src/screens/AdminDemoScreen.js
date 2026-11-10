import React, { useState, useEffect } from 'react';
import {
  ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform, Modal, Switch, FlatList
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ADMIN_SCHEMAS } from '../constants/adminSchemas';
import { ApiService } from '../services/api';

// Form values are typed as text; convert them to what the API expects.
const buildPayload = (schema, formData) => {
  const payload = { ...formData };
  schema.fields.forEach((field) => {
    if (field.keyboardType === 'numeric' && payload[field.name]) {
      payload[field.name] = Number(payload[field.name]);
    }
    if (field.type === 'boolean') {
      payload[field.name] = payload[field.name] ?? field.initialValue;
    }
  });
  return payload;
};

export default function AdminDemoScreen() {
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'list'

  // "Add content" form
  const [selectedType, setSelectedType] = useState('course');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Course list
  const [courses, setCourses] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const fetchCourses = async () => {
    setLoadingList(true);
    try {
      const data = await ApiService.getCourses();
      setCourses(Array.isArray(data) ? data : (data.results || []));
    } catch (error) {
      Alert.alert("Eroare", "Nu am putut încărca cursurile: " + error.message);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'list') {
      fetchCourses();
    }
  }, [activeTab]);

  // Not wired up: the trash button has no onPress, so nothing can be deleted from the app.
  // To enable deleting, pass onPress={() => handleDeleteCourse(item.id)} to the delete button.
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
              await ApiService.deleteCourse(id);
              Alert.alert("Succes", "Cursul a fost șters.");
              fetchCourses();
            } catch (error) {
              Alert.alert("Eroare", error.message);
            }
          }
        }
      ]
    );
  };

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
    const schema = ADMIN_SCHEMAS[selectedType];

    try {
      const created = await ApiService.create(schema.endpoint, buildPayload(schema, formData));
      Alert.alert("Succes!", `${schema.label} a fost adăugat (ID: ${created.id || 'Nou'}).`);
    } catch (error) {
      Alert.alert("Eroare", error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentSchema = ADMIN_SCHEMAS[selectedType];

  const renderCourseItem = ({ item }) => (
    <View style={styles.courseCard}>
      <View style={{flex: 1}}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ID: {item.id}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteButton}>
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

      {activeTab === 'form' ? (
        <View style={{flex: 1}}>
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

      {/* Content type picker */}
      <Modal visible={showMenu} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowMenu(false)} activeOpacity={1}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selectează Tabela</Text>
            <ScrollView>
              {Object.keys(ADMIN_SCHEMAS).map(key => (
                <TouchableOpacity
                  key={key}
                  style={styles.modalItem}
                  onPress={() => handleTypeChange(key)}
                >
                  <Text style={[styles.modalItemText, selectedType === key && {color: '#007AFF', fontWeight: 'bold'}]}>
                    {ADMIN_SCHEMAS[key].label}
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
