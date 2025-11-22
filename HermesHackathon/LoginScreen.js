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

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordVisible, setPassVisibility] = React.useState(true);
  const [loading, setLoading] = React.useState(false); 

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      alert('Te rog introdu email și parolă.');
      return;
    }

    setLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      await AsyncStorage.setItem("userToken", user.uid);
      await AsyncStorage.setItem("userEmail", email.trim().toLowerCase());
      onLoginSuccess();
    } catch (error) {
      alert("Eroare la autentificare: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (email.trim() === '' || password.trim() === '') {
      alert('Te rog introdu email și parolă.');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      handleLogin();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // Încercăm să logăm utilizatorul dacă contul există deja
        try {
          const userCredentials = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredentials.user;
          await AsyncStorage.setItem("userToken", user.uid);
          await AsyncStorage.setItem("userEmail", email.trim().toLowerCase());
          alert('Contul exista deja, te-am autentificat automat.');
          onLoginSuccess();
        } catch (loginError) {
          alert('Parola este incorectă pentru acest cont.');
        }
      } else {
        alert('Eroare la creare cont: ' + error.message);
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

            <Image 
              source={{ uri: 'https://img.icons8.com/clouds/200/000000/lock-2.png' }} // O imagine mai clean
              style={styles.headerImg}
              resizeMode="contain"
            />
            <Text style={styles.title}>Bine ai venit!</Text>
            <Text style={styles.subtitle}>Învață să salvezi vieți.</Text>
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
                 <Text style={{color: '#007AFF', fontWeight: '600'}}>
                   {passwordVisible ? "Afișează" : "Ascunde"}
                 </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Autentificare</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>SAU</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register Button */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Nu ai un cont?</Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.linkText}> Creează cont</Text>
              </TouchableOpacity>
            </View>


          </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Un gri foarte deschis, clean
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
    marginBottom: 40,
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
    // Umbre subtile
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  primaryButton: {
    backgroundColor: '#007AFF', // Albastru standard iOS/Modern
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
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