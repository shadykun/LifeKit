import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoadingView from './src/components/LoadingView';
import { STORAGE_KEYS } from './src/constants/storageKeys';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Restore the session saved by LoginScreen.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.userToken)
      .then((token) => setIsLoggedIn(token != null))
      .catch((e) => console.log('Restoring token failed', e))
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.userToken);
      setIsLoggedIn(false);
    } catch (e) {
      console.error('Eroare logout:', e);
    }
  };

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AppNavigator onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </NavigationContainer>
  );
}
