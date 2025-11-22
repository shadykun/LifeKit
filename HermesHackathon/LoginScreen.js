import React from 'react';
import { 
  ActivityIndicator, 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView
} from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseInit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { LayoutAnimation } from 'react-native';

export default function LoginScreen({ onLoginSuccess }) {
  // State pentru a comuta între Login (true) și Register (false)
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(''); // State nou pentru Vârstă
  const [passwordVisible, setPassVisibility] = useState(true);
  const [loading, setLoading] = useState(false);

  // Funcția care comută modurile cu animație
  const toggleMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsLoginMode(!isLoginMode);
    setError(null); // Resetăm erorile la schimbare
  };

  const [error, setError] = useState(null);

  const handleAuthAction = async () => {
    if (email.trim() === '' || password.trim() === '') {
      setError('Te rog completează email-ul și parola.');
      return;
    }

    // Validare simplă pentru vârstă (doar dacă suntem pe register)
    if (!isLoginMode && age.trim() === '') {
        // Momentan nu blocăm procesul, doar e bine să știi că e gol, 
        // dar poți decomenta linia de mai jos ca să obligi completarea:
        // setError('Te rog introdu vârsta.'); return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isLoginMode) {
        // --- LOGICA DE LOGIN ---
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
        await AsyncStorage.setItem("userToken", user.uid);
        await AsyncStorage.setItem("userEmail", email.trim().toLowerCase());
        onLoginSuccess();
      } else {
        // --- LOGICA DE REGISTER ---
        await createUserWithEmailAndPassword(auth, email, password);
        
        // Aici vei adăuga ulterior logica pentru salvarea vârstei în baza de date (Firestore)
        console.log("Cont creat pentru:", email, "Varsta:", age);

        // După creare cu succes, logăm automat utilizatorul
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
        await AsyncStorage.setItem("userToken", user.uid);
        await AsyncStorage.setItem("userEmail", email.trim().toLowerCase());
        
        onLoginSuccess();
      }
    } catch (err) {
      // Gestionarea erorilor specifice
      let msg = err.message;
      if (err.code === 'auth/email-already-in-use') {
        if (!isLoginMode) {
           // Dacă e la register și contul există, încercăm să îl logăm (feature-ul tău anterior)
           try {
             const userCredentials = await signInWithEmailAndPassword(auth, email, password);
             const user = userCredentials.user;
             await AsyncStorage.setItem("userToken", user.uid);
             await AsyncStorage.setItem("userEmail", email.trim().toLowerCase());
             alert('Contul exista deja, te-am autentificat automat.');
             onLoginSuccess();
             return;
           } catch (loginError) {
             msg = 'Acest email are deja cont, dar parola este incorectă.';
           }
        } else {
           msg = 'Adresa de email este deja folosită.';
        }
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Adresa de email nu este validă.';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'Parolă incorectă.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Parola trebuie să aibă minim 6 caractere.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.contentContainer}>
          
          {/* HEADER / LOGO */}
          <View style={styles.header}>
            <Image 
              source={{ uri: isLoginMode ? 'https://img.icons8.com/clouds/200/000000/lock-2.png' : 'https://img.icons8.com/clouds/200/000000/add-user-male.png' }} 
              style={styles.headerImg}
              resizeMode="contain"
            />
            <Text style={styles.title}>
              {isLoginMode ? "Bine ai venit!" : "Creează Cont"}
            </Text>
            <Text style={styles.subtitle}>
              {isLoginMode ? "Învață să salvezi vieți." : "Alătură-te comunității noastre."}
            </Text>
          </View>

          {/* FORMULARE */}
          <View style={styles.form}>
            
            {/* Email Input */}
            <Text style={styles.inputTitle}>Email</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.inputText} 
                value={email} 
                onChangeText={setEmail} 
                placeholder="nume@email.com"
                placeholderTextColor="#a0a0a0"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password Input */}
            <Text style={styles.inputTitle}>Parolă</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={[styles.inputText, { flex: 1 }]} 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={passwordVisible}
                placeholder="••••••"
                placeholderTextColor="#a0a0a0"
              />
              <TouchableOpacity onPress={() => setPassVisibility(!passwordVisible)} style={styles.eyeIcon}>
                 <Text style={{color: '#007AFF', fontWeight: '600', fontSize: 13}}>
                   {passwordVisible ? "Afișează" : "Ascunde"}
                 </Text>
              </TouchableOpacity>
            </View>

            {/* INPUT VÂRSTĂ (DOAR LA REGISTER) */}
            {!isLoginMode && (
              <View>
                <Text style={styles.inputTitle}>Vârstă</Text>
                <View style={styles.inputContainer}>
                  <TextInput 
                    style={styles.inputText} 
                    value={age} 
                    onChangeText={setAge} 
                    placeholder="Ex: 24"
                    placeholderTextColor="#a0a0a0"
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
              </View>
            )}

            {/* Mesaj de Eroare */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Main Action Button */}
            <TouchableOpacity 
              style={[styles.primaryButton, !isLoginMode && { backgroundColor: '#34C759' }]} // Verde pentru Register
              onPress={handleAuthAction}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isLoginMode ? "Autentificare" : "Înregistrare"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>SAU</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Toggle Button (Footer) */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {isLoginMode ? "Nu ai un cont?" : "Ai deja un cont?"}
              </Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={[styles.linkText, !isLoginMode && { color: '#34C759' }]}>
                   {isLoginMode ? " Creează cont" : " Autentifică-te"}
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA', 
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerImg: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  inputTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#007AFF', 
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#666',
  },
  linkText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: 'bold',
  }
});