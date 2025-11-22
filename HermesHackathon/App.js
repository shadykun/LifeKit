import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './LoginScreen'; 
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
      setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const handleLoginSuccess = () => {
    setUserToken('logged-in'); 
  };

  const handleLogout = () => {
    setUserToken(null);
  };

  if (isLoading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#007AFF"/>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken == null ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <MainApp onLogout={handleLogout}/>
      )}
    </NavigationContainer>
  );
}