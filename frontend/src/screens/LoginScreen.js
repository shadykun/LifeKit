import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

import { STORAGE_KEYS } from '../constants/storageKeys';
import { auth } from '../services/firebase';

const AUTH_ERROR_MESSAGES = {
  'auth/invalid-email': 'Adresa de email nu este validă.',
  'auth/wrong-password': 'Parolă incorectă.',
  'auth/weak-password': 'Parola trebuie să aibă minim 6 caractere.',
};

const signInAndPersist = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  await AsyncStorage.setItem(STORAGE_KEYS.userToken, user.uid);
  await AsyncStorage.setItem(STORAGE_KEYS.userEmail, email.trim().toLowerCase());
};

export default function LoginScreen({ onLoginSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Collected on registration but not persisted anywhere yet.
  const [age, setAge] = useState('');
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsLoginMode(!isLoginMode);
    setError(null);
  };

  const handleAuthAction = async () => {
    if (email.trim() === '' || password.trim() === '') {
      setError('Te rog completează email-ul și parola.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!isLoginMode) {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      await signInAndPersist(email, password);
      onLoginSuccess();
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        // Registering an existing account: fall back to signing in with the given password.
        try {
          await signInAndPersist(email, password);
          alert('Contul exista deja, te-am autentificat automat.');
          onLoginSuccess();
        } catch {
          setError('Acest email are deja cont, dar parola este incorectă.');
        }
      } else {
        setError(AUTH_ERROR_MESSAGES[err.code] ?? err.message);
      }
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

          <View style={styles.form}>

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

            <Text style={styles.inputTitle}>Parolă</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.inputText, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={isPasswordHidden}
                placeholder="••••••"
                placeholderTextColor="#a0a0a0"
              />
              <TouchableOpacity onPress={() => setIsPasswordHidden(!isPasswordHidden)} style={styles.eyeIcon}>
                 <Text style={{color: '#007AFF', fontWeight: '600', fontSize: 13}}>
                   {isPasswordHidden ? "Afișează" : "Ascunde"}
                 </Text>
              </TouchableOpacity>
            </View>

            {/* Age is only asked for on registration */}
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

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.primaryButton, !isLoginMode && { backgroundColor: '#34C759' }]}
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

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>SAU</Text>
              <View style={styles.dividerLine} />
            </View>

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
