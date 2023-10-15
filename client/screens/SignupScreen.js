View
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import {useNavigation} from '@react-navigation/native'
import baseURL from '../base_url'
import axios from 'axios'

const SignupScreen = () => {
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState();
  const navigation = useNavigation();

  const clearFields = ()=>{
    setEmail('');
    setPassword('');
    setUsername('');
    setImage('');
  }

  const handleRegister = async ()=>{
    setIsDisabled(true);
    setLoading(true);
    console.log(email)
    //TODO : call api to register user and save data in database
    try {
      const response = await axios.post(`${baseURL}/register`, {
        email,
        name:username ,
        password,
        image
      })
      alert("User registered successfully")
      clearFields();
      console.log(response);
      navigation.navigate("Login")
      setLoading(false);
      setIsDisabled(false);
    } catch (error) {
      setLoading(false);
      setIsDisabled(false);
      console.log(error)
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
          
          <Text style={{ fontSize: 17, fontWeight: "600" }}>Create a new account</Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <View>
            <Text>Email</Text>
            <TextInput value={email} onChangeText={(text) => setEmail(text)} style={{fontSize:email? 18: 18, borderBottomColor: "gray", borderBottomWidth: 1, marginVertical: 10, width: 300 }} placeholderTextColor={"grey"} placeholder="Enter Your Email" />
          </View>
        </View>
        <View style={{ marginTop: 15 }}>
          <View>
            <Text>Username</Text>
            <TextInput value={username} onChangeText={(text) => setUsername(text)} style={{fontSize:email? 18: 18, borderBottomColor: "gray", borderBottomWidth: 1, marginVertical: 10, width: 300 }} placeholderTextColor={"grey"} placeholder="Enter a username" />
          </View>
        </View>
        <View style={{ marginTop: 15 }}>
          <View>
            <Text>image (optional)</Text>
            <TextInput value={image} onChangeText={(text) => setImage(text)} style={{fontSize:email? 18: 18, borderBottomColor: "gray", borderBottomWidth: 1, marginVertical: 10, width: 300 }} placeholderTextColor={"grey"} placeholder="paste a url of your profile image" />
          </View>
        </View>
        <View style={{ marginTop: 15 }}>
          <View>
            <Text>Password</Text>
            <TextInput secureTextEntry={true} value={password} onChangeText={(text) => setPassword(text)} style={{fontSize:email? 18: 18, borderBottomColor: "gray", borderBottomWidth: 1, marginVertical: 10, width: 300 }} placeholderTextColor={"grey"} placeholder="Enter Your Password" />
          </View>
        
        <Pressable disabled={isDisabled} onPress={handleRegister} style={{width:200, backgroundColor:`${isDisabled?'grey':'black'}`, padding:15, marginTop:50, marginLeft:'auto', marginRight:'auto', borderRadius:10}}>
          <Text style={{color:"white", fontSize:16,textAlign:'center', fontWeight:600}}>{loading?'signing up...':'Sign Up'}</Text>
        </Pressable>
        <Pressable onPress={()=> navigation.navigate("Login")} style={{marginTop:20}}>
          <Text style={{textAlign:"center", color:'grey'}}>
            Already have an account? Login
          </Text>
        </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default SignupScreen

const styles = StyleSheet.create({})