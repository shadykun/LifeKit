import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTĂM ECRANELE ---
// Asigură-te că fișierele există în folderul 'src/screens/' sau 'screens/'
// Ajustează calea '../screens/...' dacă fișierele tale sunt direct în folderul 'screens'
import HomeScreen from './screens/HomeScreen';
import ModulesScreen from './screens/ModulesScreen';
import ProfileScreen from './screens/ProfileScreen';
import ModuleDetailScreen from './screens/ModuleDetailScreen';
import ScenarioScreen from './screens/ScenarioScreen';
import QuizScreen from './screens/QuizScreen';
import FlashcardsScreen from './screens/FlashcardsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// --- COMPONENTA 1: MENIUL DE JOS (TABS) ---
function HomeTabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Ascundem header-ul default al tab-urilor
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

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Modules') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Acasă' }}
      />
      <Tab.Screen 
        name="Modules" 
        component={ModulesScreen} 
        options={{ tabBarLabel: 'Învățare' }}
      />
      <Tab.Screen 
        name="Profile" 
        options={{ tabBarLabel: 'Profil' }}
      >
        {/* Pasăm funcția de logout către ecranul de profil */}
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// --- COMPONENTA 2: NAVIGAȚIA PRINCIPALĂ (STACK) ---
export default function MainApp({ onLogout }) {
  
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      onLogout(); // Apelează funcția din App.js pentru a schimba starea la "Nelogat"
    } catch (e) {
      console.error("Eroare la logout: ", e);
    }
  };

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#333',
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitleVisible: false, // Ascunde textul "Back" pe iOS
        }}
      >
        {/* 1. Ecranul Principal (conține Tab-urile) */}
        <Stack.Screen 
          name="MainTabs" 
          options={{ headerShown: false }}
        >
           {() => <HomeTabs onLogout={handleLogout} />}
        </Stack.Screen>

        {/* 2. Ecranele de Detaliu (se deschid peste Tab-uri) */}
        <Stack.Screen 
          name="ModuleDetail" 
          component={ModuleDetailScreen} 
          options={({ route }) => ({ title: route.params?.moduleTitle || 'Modul' })} 
        />
        
        <Stack.Screen 
          name="Scenario" 
          component={ScenarioScreen} 
          options={{ title: 'Simulare Caz' }} 
        />
        
        <Stack.Screen 
          name="Quiz" 
          component={QuizScreen} 
          options={{ title: 'Testare Cunoștințe' }} 
        />
        
        <Stack.Screen 
          name="Flashcards" 
          component={FlashcardsScreen} 
          options={{ title: 'Flashcards' }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}