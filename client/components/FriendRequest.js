import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import { UserType } from '../UserContext'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import baseURL from '../base_url'

const FriendRequest = ({ user, sentFriendRequests, friendRequests }) => {
  const dummyUserDP = 'https://res.cloudinary.com/duaob0aso/image/upload/v1691231960/userProfile_s3xqnt.png'
  const { userId, setUserId } = useContext(UserType)
  const navigation = useNavigation();


  const handleAcceptFriendRequest = async (friendRequestId) => {
    
    console.log("line 14 in friend request")
    console.log(user._id)
    console.log(userId)
    try {
      const response = await axios.post(`${baseURL}/friend-request/accept`, {
        senderId: friendRequestId,
        receipentId: userId
      });
      console.log("at line 22 in handleAcceptFriendRequest")
      if (response) {
        sentFriendRequests(friendRequests.filter((request) => { request._id != friendRequestId }));
        navigation.navigate("Chats");

        console.log("at line no 33 in handleAcceptFriendRequest")
      
      }
    } catch (error) {
   
      console.log(error)
    }
  }
  return (
    <Pressable style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
      <Image source={{ uri: user.image ? user.image : dummyUserDP }} style={{ width: 50, height: 50, borderRadius: 25 }} />
      <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 10, flex: 1 }}>{user?.name}  wants to be your friend!</Text>
      <Pressable onPress={()=>handleAcceptFriendRequest(user._id)} style={{ backgroundColor: "#000", padding: 10, borderRadius: 6 }}>
      <Text style={{ color: "#fff", textAlign: 'center' }}>Accept</Text>
        
      </Pressable>
    </Pressable>
  )
}

export default FriendRequest
 
const styles = StyleSheet.create({})