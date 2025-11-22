import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import ModulesScreen from '../screens/ModulesScreen';
import QuizScreen from '../screens/QuizScreen';
import FlashcardsScreen from '../screens/FlashcardsScreen';

const Stack = createNativeStackNavigator();

export default function ModulesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#F5F7FA' },
        headerTintColor: '#333',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
      }}
    >
      <Stack.Screen
        name="ModulesScreen"
        component={ModulesScreen}
        options={{ title: 'Module' }}
      />
      <Stack.Screen
        name="QuizScreen"
        component={QuizScreen}
        options={{
          title: 'Quiz',
          headerLeft: () => null, // Hide back on Quiz
        }}
      />
      <Stack.Screen
        name="FlashcardsScreen"
        component={FlashcardsScreen}
        options={{ title: 'Flashcards' }}
      />
    </Stack.Navigator>
  );
}
