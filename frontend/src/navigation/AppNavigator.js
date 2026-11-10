import React from 'react';
import { StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import AdminDemoScreen from '../screens/AdminDemoScreen';
import FlashcardsScreen from '../screens/FlashcardsScreen';
import HomeScreen from '../screens/HomeScreen';
import LearningHubScreen from '../screens/LearningHubScreen';
import MapScreen from '../screens/MapScreen';
import ModuleDetailScreen from '../screens/ModuleDetailScreen';
import ModulesScreen from '../screens/ModulesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import QuizScreen from '../screens/QuizScreen';
import ScenarioScreen from '../screens/ScenarioScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = {
  Home: 'home',
  LearningHub: 'grid',
  Profile: 'person',
};

function HomeTabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
          borderTopWidth: 0,
          elevation: 5,
          shadowOpacity: 0.1,
          backgroundColor: '#fff',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icon = TAB_ICONS[route.name];
          return <Ionicons name={focused ? icon : `${icon}-outline`} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Acasă' }} />
      <Tab.Screen name="LearningHub" component={LearningHubScreen} options={{ tabBarLabel: 'Învățare' }} />
      <Tab.Screen name="Profile" options={{ tabBarLabel: 'Profil' }}>
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Root stack of the signed-in app: the bottom tabs plus the screens pushed on top of them.
export default function AppNavigator({ onLogout }) {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#333',
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name="MainTabs" options={{ headerShown: false }}>
          {() => <HomeTabs onLogout={onLogout} />}
        </Stack.Screen>

        <Stack.Screen name="Modules" component={ModulesScreen} options={{ title: 'Module Teoretice' }} />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Harta Locații' }} />
        <Stack.Screen
          name="ModuleDetail"
          component={ModuleDetailScreen}
          options={({ route }) => ({ title: route.params?.moduleTitle || 'Modul' })}
        />
        <Stack.Screen name="Scenario" component={ScenarioScreen} options={{ title: 'Simulare Caz' }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Testare' }} />
        <Stack.Screen name="Flashcards" component={FlashcardsScreen} options={{ title: 'Flashcards' }} />
        <Stack.Screen name="AdminDemo" component={AdminDemoScreen} options={{ title: 'Panou Admin (Demo)' }} />
      </Stack.Navigator>
    </>
  );
}
