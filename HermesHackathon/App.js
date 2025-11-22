import React, {useEffect} from 'react';
import LoginScreen from './LoginScreen';
import MainApp from './MainApp';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [LoggedIn, setLogin] = React.useState(false);

  useEffect(()  =>{
    const checkLogin = async () =>
      {
        const token = await AsyncStorage.getItem('userToken');
        if(token)
          setLogin(true);
        else
          setLogin(false);
      }
      checkLogin();
  }, []);

  if(LoggedIn == false)
   {
    return <LoginScreen onLoginSuccess={() => setLogin(true)} />;
   }
  return <MainApp onLogout={() => setLogin(false)}/>;
}
