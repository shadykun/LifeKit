import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; // AICI este containerul suprem
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importăm ecranele
// Notă: Ajustează calea dacă LoginScreen e în folderul 'screens'
import LoginScreen from './LoginScreen'; // Sau './LoginScreen' dacă e în root
import MainApp from './MainApp';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log('Restoring token failed', e);
      }
      // După ce am verificat stocarea, actualizăm starea
      setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  // Funcții de control pentru Login/Logout
  const handleLoginSuccess = () => {
    // Când ne logăm, setăm token-ul (chiar și unul dummy) ca să schimbăm ecranul
    setUserToken('logged-in'); 
  };

  const handleLogout = () => {
    setUserToken(null);
  };

  // 1. Cât timp verificăm memoria, arătăm un spinner
  if (isLoading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#007AFF"/>
      </View>
    );
  }

  // 2. Structura Principală
  return (
    <NavigationContainer>
      {userToken == null ? (
        // Dacă NU suntem logați, arătăm ecranul de Login
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        // Dacă suntem logați, arătăm Aplicația Principală
        <MainApp onLogout={handleLogout}/>
      )}
    </NavigationContainer>
  );
}