import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { UserType } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseURL from '../base_url';
import jwt_decode from 'jwt-decode'
import User from '../components/User';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([])
  const {userId, setUserId} = useContext(UserType);
  const handleNavigateToFriends = ()=>{
    navigation.navigate('Friends')
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "ChatVerse",
      headerRight: () => (
        <View style={{flexDirection:"row", alignItems:"center", gap:8}}>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
          <Ionicons onPress={handleNavigateToFriends} name="people-outline" size={24} color="black" />
        </View>
      ),
    });
  }, []);
  useEffect(() => {
    try {
      const fetchUsers = async ()=>{
        const token = await AsyncStorage.getItem("authToken")
        const decodedToken = jwt_decode(token)
        const userId = decodedToken.userId
        setUserId(userId)
        const response = await axios.get(`${baseURL}/users/${userId}`);
        setUsers(response.data)
        
      }
      fetchUsers();
    } catch (error) {
      console.log(error)
    }
  }, [])
  
  return (
    <ScrollView>
      <View style={{padding:10}}>
        {users && users.map((user, index)=>{
          return (
            <User key={index} user={user}/>
          )
        })}
      </View>
      <View style={{padding:10}}>
        {users && users.map((user, index)=>{
          return (
            <User key={index} user={user}/>
          )
        })}
      </View>

    </ScrollView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})