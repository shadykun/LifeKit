import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, Button, Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from './firebaseInit';
import react, { useEffect } from 'react';
import { set } from 'firebase/database';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text>Loading Home Screen {'\n'}</Text>
      <ActivityIndicator size = "large" color = "lightblue"/>
    </View>
  );
}

function ProfileScreen({ onLogout }) {

  const [user,setUser] = react.useState(null);

  useEffect(() =>{
    const getEmail = async () => {
    const email = await AsyncStorage.getItem('userEmail');
    setUser(email);
  }
    getEmail();
  }, []);

  return (
  <View style={{ flex: 1, paddingTop: 50, alignItems: 'center' }}>
    <Image
      source={require('./assets/Images/user.png')}
      style={{ width: 40, height: 40 }}
    />
  <View style = {{marginRight: 'auto', paddingHorizontal: 15, marginTop:30}}>
    <Text style= {{fontSize:18}} >
    Email: {user ? user : 'No user logged in'}
    </Text>
  </View>
    <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20, width: '100%' }}>
      <Button title="Log Out" color="red" onPress={onLogout} />
    </View>
  </View>
  );
}


export default function MainApp({onLogout}) {
  const handleLogout = async () =>{
      await AsyncStorage.removeItem('userToken');
      onLogout();
  }
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
        <Tab.Screen name="Profile" options={{headerShown:false}}>
         {() => <ProfileScreen onLogout={handleLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}