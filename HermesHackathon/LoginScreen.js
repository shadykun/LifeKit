import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet, Image, Button, TextInput} from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseInit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ onLoginSuccess }){
  const [email,setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordVisible, SetPassVisibility] = React.useState(true);

  const handleLogin = async () => {
    let ok = true;
  
    if (email.trim() === '') {
      alert('Te rog introdu un email.');
      ok = false;
    }
  
    else if (password.trim() === '') {
      alert('Te rog introdu parola.');
      ok = false;
    }
  
    if (ok) {
      try
      {    
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
        await AsyncStorage.setItem("userToken", user.uid);
        await AsyncStorage.setItem("userEmail", email.trim().toLowerCase());
        onLoginSuccess();
    } catch(error) {
      alert("Login error: " + error.message);
    }
    } 
  };
  
  const handleRegister = async () => {
    let ok = true;
  
    if (email.trim() === '') {
      alert('Te rog introdu un email.');
      ok = false;
    }
  
    else if (password.trim() === '') {
      alert('Te rog introdu parola.');
      ok = false;
    }
    if(ok) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        handleLogin();
      }
      catch(error)
      {
        if (error.code === 'auth/email-already-in-use') {
          try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;
            await AsyncStorage.setItem("userToken", user.uid);
            await AsyncStorage.setItem("userEmail", email.trim().toLowerCase());
            alert('Account already exists, so you got logged automatically.');
            onLoginSuccess();
          }
          catch(loginError){
            alert('Account failed to create: Email already associated to an account')
          }
      }
    }
  }
}

  return (
    <View style={LoginStyle.container}>
        <View style = {LoginStyle.header}>
            <Image source={{uri:'https://static.vecteezy.com/system/resources/thumbnails/002/205/981/small_2x/lock-icon-free-vector.jpg'}}
            style = {LoginStyle.HeaderImg}
            alt='Logo' />
        </View>
      <Text style={LoginStyle.text}>Sign in with your account.</Text>
      <Text style={LoginStyle.InputTitle}>Email</Text>
      <TextInput style={LoginStyle.InputText} value={email.toLowerCase()} onChangeText={setEmail}/>
      <Text style={LoginStyle.InputTitle}>Password</Text>
      <TextInput style={LoginStyle.InputText} value={password} onChangeText={setPassword} secureTextEntry={passwordVisible}/>
      <Button title={passwordVisible ? "Afiseaza parola" : "Ascunde parola"}
        onPress={() => SetPassVisibility(!passwordVisible)}
      />
      <View style={LoginStyle.button}>
      <Button title='Login' color = 'blue' style = {LoginStyle.button} onPress={handleLogin} />
      </View>
      <View>
      <Text style={LoginStyle.InputTitle}>Don't have an accout?</Text>
      <Button title = 'Create Account' onPress={handleRegister}/>
      </View>
    </View>
  );
}

const LoginStyle = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#d9f6ff',
  },
  text: {
    color: '#000',
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  header:
  {
    marginVertical: 36,
  },
  HeaderImg:{
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 20,
  },
  InputTitle:{
    alignSelf: 'left',
    fontSize: 20,
    marginBottom:10,
    marginTop: 15,
  },
  InputText:{
    alignSelf: 'left',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  button:{
    marginTop:20,
    backgroundColor:'lightgreen',
    borderRadius:20,
    paddingVertical:6,
    paddingHorizontal:20
  },
  checkBoxContainer:{
    flexDirection: 'row',
    marginBottom: 20,
  },
});
