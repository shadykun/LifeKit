import React from 'react';
import { StatusBar } from 'react-native';
// 1. SCOATEM NavigationContainer DE AICI. (E deja în App.js)
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';

// 2. IMPORTĂM ECRANELE
import HomeScreen from './screens/HomeScreen';
import ModulesScreen from './screens/ModulesScreen';
import ProfileScreen from './screens/ProfileScreen';
import ModuleDetailScreen from './screens/ModuleDetailScreen';
import ScenarioScreen from './screens/ScenarioScreen';
import QuizScreen from './screens/QuizScreen';
import FlashcardsScreen from './screens/FlashcardsScreen';
import LearningHubScreen from './screens/LearningHubScreen';
import MapScreen from './screens/MapScreen';

// IMPORT NOU: Admin Screen
import AdminDemoScreen from './screens/AdminDemoScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// --- MENIUL DE JOS (TABS) ---
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
          backgroundColor: '#fff'
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'LearningHub') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
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

// --- NAVIGAȚIA PRINCIPALĂ (STACK) ---
export default function MainApp({ onLogout }) {
  
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      onLogout();
    } catch (e) {
      console.error("Eroare logout:", e);
    }
  };

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
        {/* 1. Ecranele Principale (Tabs) */}
        <Stack.Screen name="MainTabs" options={{ headerShown: false }}>
           {() => <HomeTabs onLogout={handleLogout} />}
        </Stack.Screen>

        {/* 2. Ecranele din Hub */}
        <Stack.Screen 
          name="Modules" 
          component={ModulesScreen} 
          options={{ title: 'Module Teoretice' }} 
        />
        
        <Stack.Screen 
          name="Map" 
          component={MapScreen} 
          options={{ title: 'Harta Locații' }} 
        />

        {/* 3. Restul Ecranelor */}
        <Stack.Screen 
          name="ModuleDetail" 
          component={ModuleDetailScreen} 
          options={({ route }) => ({ title: route.params?.moduleTitle || 'Modul' })} 
        />
        <Stack.Screen name="Scenario" component={ScenarioScreen} options={{ title: 'Simulare Caz' }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Testare' }} />
        <Stack.Screen name="Flashcards" component={FlashcardsScreen} options={{ title: 'Flashcards' }} />

        {/* 4. ECRANUL ADMIN (NOU) */}
        <Stack.Screen 
          name="AdminDemo" 
          component={AdminDemoScreen} 
          options={{ title: 'Panou Admin (Demo)' }} 
        />

      </Stack.Navigator>
    </>
  );
}