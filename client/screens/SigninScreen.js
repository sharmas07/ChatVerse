import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import {useNavigation} from '@react-navigation/native'
import baseURL from '../base_url';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const SigninScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    
    AsyncStorage.clear(); // for test remove afterwards

    const checkLoginStatus = async ()=>{
      let token = await AsyncStorage.getItem("authToken");
      if(token){
        navigation.replace("Home");
      }
    }
    checkLoginStatus();
  }, [])
  

  const handleLogin = async ()=>{
    console.log("login got hit", email);
    try {
      const {data} = await axios.post(`${baseURL}/login`, {email, password})
      console.log(data);
      AsyncStorage.setItem("authToken", data)
      navigation.replace("Home");
    } catch (error) {
      alert("please enter correct credentials")
    }
  }
  return (
    <View style={{
      flex: 1,
      backgroundColor: "white",
      padding: 10,
      alignItems: "center"
    }}>
      <KeyboardAvoidingView>
        <View style={{ marginTop: 100, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: "#4A55A2", fontSize: 17, fontWeight: "600" }}>
            Login
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "600" }}>Login into your account</Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <View>
            <Text>Email</Text>
            <TextInput value={email} onChangeText={(text) => setEmail(text)} style={{fontSize:email? 18: 18, borderBottomColor: "gray", borderBottomWidth: 1, marginVertical: 10, width: 300 }} placeholderTextColor={"grey"} placeholder="Enter Your Email" />
          </View>
        </View>
        <View style={{ marginTop: 25 }}>
          <View>
            <Text>Password</Text>
            <TextInput secureTextEntry={true} value={password} onChangeText={(text) => setPassword(text)} style={{fontSize:email? 18: 18, borderBottomColor: "gray", borderBottomWidth: 1, marginVertical: 10, width: 300 }} placeholderTextColor={"grey"} placeholder="Enter Your Password" />
          </View>
        
        <Pressable onPress={handleLogin} style={{width:200, backgroundColor:"black", padding:15, marginTop:50, marginLeft:'auto', marginRight:'auto', borderRadius:10}}>
          <Text style={{color:"white", fontSize:16,textAlign:'center', fontWeight:600}}>Login</Text>
        </Pressable>
        <Pressable onPress={()=> navigation.navigate("Register")} style={{marginTop:20}}>
          <Text style={{textAlign:"center", color:'grey'}}>
            Don't have an account? Sign Up
          </Text>
        </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default SigninScreen

const styles = StyleSheet.create({})