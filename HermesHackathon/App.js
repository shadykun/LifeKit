import React, { useEffect, useState, createContext } from 'react';
import { View, ActivityIndicator, Appearance } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './LoginScreen'; 
import MainApp from './MainApp';

export const ThemeContext = createContext();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === 'dark');

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('userToken');
        const storedTheme = await AsyncStorage.getItem('appTheme');
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === 'dark');
          Appearance.setColorScheme(storedTheme);
        } else {
          Appearance.setColorScheme(Appearance.getColorScheme());
        }
      } catch (e) {
        console.log('Restoring token failed', e);
      }
      setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => subscription.remove();
  }, []);

  const handleLoginSuccess = () => {
    setUserToken('logged-in'); 
  };

  const handleLogout = () => {
    setUserToken(null);
  };

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('appTheme', newMode ? 'dark' : 'light');
    Appearance.setColorScheme(newMode ? 'dark' : 'light');
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