import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import baseURL from '../base_url';
import UserChat from '../components/UserChat';


const ChatScreen = () => {
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const {userId, setUserId} = useContext(UserType);
    const navigation = useNavigation();
    
    useEffect(() => {
        const getFriends = async ()=>{
          console.log("get frnds got hit")
            try {
                const response = await axios.get(`${baseURL}/accepted-friends/${userId}`);
                setAcceptedFriends(response.data);
               
                console.log(acceptedFriends)
            } catch (error) {
                console.log(error)
            }
        }
        getFriends();
    }, [])
    
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable>
        {acceptedFriends.length!==0?acceptedFriends.map((user, index)=>{
            return <UserChat key={index} user={user} />
        }):<Text>You've got no friends, Make some !</Text>}
      </Pressable>
    </ScrollView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({})