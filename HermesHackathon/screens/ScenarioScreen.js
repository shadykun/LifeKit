import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Alert 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CPR_SCENARIO } from '../ScenarioData'; 

export default function ScenarioScreen({ navigation }) {
  // 'selection' = meniul de start
  // 'interactive' = scenariul text+imagini
  // 'kids' = modul video/animat
  const [viewMode, setViewMode] = useState('selection'); 

  // --- STATE PENTRU MODUL INTERACTIV ---
  const initialNode = CPR_SCENARIO.find(node => node.id === 'start');
  const [currentNode, setCurrentNode] = useState(initialNode);

  // Navigare în scenariul text
  const handleChoice = (nextNodeId) => {
    const nextNode = CPR_SCENARIO.find(node => node.id === nextNodeId);
    if (nextNode) setCurrentNode(nextNode);
    else Alert.alert("Eroare", "Scenariul s-a terminat brusc.");
  };

  // Restart scenariu text
  const handleRestart = () => {
    setCurrentNode(initialNode);
  };

  // Revenire la meniul de selecție
  const goBackToMenu = () => {
    setViewMode('selection');
    setCurrentNode(initialNode); // Resetăm și progresul
  };

  // =================================================
  // 1. ECRANUL DE SELECȚIE (MENIUL PRINCIPAL)
  // =================================================
  const renderSelectionScreen = () => (
    <View style={styles.menuContainer}>
      <View style={styles.headerContainer}>
        <Ionicons name="school-outline" size={60} color="#007AFF" />
        <Text style={styles.menuTitle}>Alege Modul de Învățare</Text>
        <Text style={styles.menuSubtitle}>Cum preferi să parcurgi acest scenariu?</Text>
      </View>

      {/* OPȚIUNEA A: TEXT & IMAGINI */}
      <TouchableOpacity 
        style={styles.modeCard} 
        activeOpacity={0.9}
        onPress={() => setViewMode('interactive')}
      >
        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
          <Ionicons name="document-text" size={32} color="#1565C0" />
        </View>
        <View style={styles.cardTextContent}>
          <Text style={styles.modeTitle}>Scenariu Interactiv</Text>
          <Text style={styles.modeDesc}>
            Bazat pe text, imagini și decizii pas cu pas. Ideal pentru studiu detaliat.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>

      {/* OPȚIUNEA B: ANIMAT / COPII */}
      <TouchableOpacity 
        style={styles.modeCard} 
        activeOpacity={0.9}
        onPress={() => setViewMode('kids')}
      >
        <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
          <Ionicons name="videocam" size={32} color="#EF6C00" />
        </View>
        <View style={styles.cardTextContent}>
          <Text style={styles.modeTitle}>Mod Animat (Kids)</Text>
          <Text style={styles.modeDesc}>
            Explicații video și animații simplificate. Ideal pentru copii și începători.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>
    </View>
  );

  // =================================================
  // 2. MODUL KIDS (VIDEO PLACEHOLDER)
  // =================================================
  const renderKidsMode = () => (
    <View style={styles.kidsContainer}>
      <TouchableOpacity style={styles.backButtonTop} onPress={goBackToMenu}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backText}>Înapoi la Meniu</Text>
      </TouchableOpacity>

      <View style={styles.videoPlayerPlaceholder}>
        <Ionicons name="play-circle" size={80} color="white" />
        <Text style={{color:'white', marginTop:10, fontWeight:'bold'}}>VIDEO PLAYER</Text>
      </View>

      <Text style={styles.kidsTitle}>Micule Salvator! 🦸‍♂️</Text>
      <Text style={styles.kidsDesc}>
        Urmărește videoclipul de mai sus pentru a vedea cum poți ajuta pe cineva care are nevoie. Fii atent la pași!
      </Text>
    </View>
  );

  // =================================================
  // 3. MODUL INTERACTIV (LOGICA VECHE)
  // =================================================
  const renderInteractiveMode = () => {
    // A. FINAL SCENARIU
    if (currentNode.isTerminal) {
      const isSuccess = currentNode.success;
      return (
        <View style={styles.terminalContainer}>
           <View style={[styles.resultCard, {backgroundColor: isSuccess ? '#4CAF50' : '#E53935'}]}>
              <Ionicons name={isSuccess ? "trophy" : "close-circle"} size={80} color="#fff" />
              <Text style={styles.terminalTitle}>{isSuccess ? "VICTORIE!" : "AI PIERDUT"}</Text>
              <Text style={styles.terminalBody}>{currentNode.text}</Text>
              
              <TouchableOpacity style={styles.restartBtn} onPress={handleRestart}>
                <Ionicons name="refresh" size={24} color={isSuccess ? '#4CAF50' : '#E53935'} />
                <Text style={[styles.restartText, { color: isSuccess ? '#4CAF50' : '#E53935' }]}>
                  Reia Scenariul
                </Text>
              </TouchableOpacity>
           </View>
           
           <TouchableOpacity style={styles.menuBtn} onPress={goBackToMenu}>
             <Text style={{color: '#666', fontWeight: 'bold'}}>Alege alt mod de învățare</Text>
           </TouchableOpacity>
        </View>
      );
    }

    // B. SCENARIU ACTIV
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Bar pt Navigare */}
        <View style={styles.navBar}>
           <TouchableOpacity onPress={goBackToMenu} style={{flexDirection:'row', alignItems:'center'}}>
             <Ionicons name="arrow-back" size={24} color="#007AFF"/>
             <Text style={{color:'#007AFF', marginLeft:5, fontWeight:'bold'}}>Meniu</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
           <Image 
             source={{ uri: currentNode.image }} 
             style={styles.scenarioImage}
             resizeMode="contain"
           />
        </View>

        <View style={styles.textCard}>
          <Text style={styles.questionText}>{currentNode.text}</Text>
        </View>

        <Text style={styles.instructionLabel}>Decizia ta:</Text>

        {currentNode.choices.map((choice, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.choiceBtn} 
            onPress={() => handleChoice(choice.nextNodeId)}
          >
            <View style={styles.indexBadge}><Text style={{fontWeight:'bold'}}>{index + 1}</Text></View>
            <Text style={styles.choiceText}>{choice.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // --- RENDER PRINCIPAL ---
  return (
    <SafeAreaView style={styles.mainContainer}>
      {viewMode === 'selection' && renderSelectionScreen()}
      {viewMode === 'kids' && renderKidsMode()}
      {viewMode === 'interactive' && renderInteractiveMode()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F5F7FA' },

  // --- STILURI MENIU SELECȚIE ---
  menuContainer: { flex: 1, padding: 20, justifyContent: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  menuTitle: { fontSize: 26, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 5 },
  menuSubtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
  
  modeCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, 
    borderRadius: 20, marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 
  },
  iconBox: { width: 60, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardTextContent: { flex: 1, marginRight: 10 },
  modeTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  modeDesc: { fontSize: 13, color: '#666', lineHeight: 18 },

  // --- STILURI KIDS MODE ---
  kidsContainer: { flex: 1, alignItems: 'center', padding: 20 },
  backButtonTop: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backText: { fontSize: 16, color: '#333', marginLeft: 5, fontWeight: '600' },
  videoPlayerPlaceholder: { 
    width: '100%', height: 220, backgroundColor: '#000', borderRadius: 20, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 30, elevation: 5 
  },
  kidsTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  kidsDesc: { fontSize: 16, color: '#555', textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 },

  // --- STILURI INTERACTIVE MODE ---
  scrollContent: { padding: 20 },
  navBar: { marginBottom: 15 },
  imageContainer: { 
    width: '100%', height: 180, marginBottom: 20, backgroundColor: '#fff', 
    borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 2 
  },
  scenarioImage: { width: 150, height: 150 },
  textCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 20, elevation: 2 },
  questionText: { fontSize: 18, color: '#333', lineHeight: 26, textAlign: 'center', fontWeight: '600' },
  instructionLabel: { alignSelf: 'flex-start', color: '#666', marginBottom: 10, fontWeight: 'bold', marginLeft: 5 },
  choiceBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  indexBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: '#ccc' },
  choiceText: { fontSize: 15, color: '#333', flex: 1 },

  // --- STILURI REZULTAT FINAL ---
  terminalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  resultCard: { width: '100%', padding: 30, borderRadius: 25, alignItems: 'center', elevation: 5 },
  terminalTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 20, marginBottom: 10 },
  terminalBody: { fontSize: 16, color: '#fff', textAlign: 'center', marginBottom: 30, lineHeight: 24 },
  restartBtn: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, alignItems: 'center' },
  restartText: { fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  menuBtn: { marginTop: 25, padding: 10 }
});