import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import baseURL from '../base_url';
import { UserType } from '../UserContext';
import axios from 'axios';
import FriendRequest from '../components/FriendRequest';

const FriendsScreen = () => {
    const {userId, setUserId} = useContext(UserType);
    const [friendRequests, sentFriendRequests] = useState([]);
    useEffect(() => {
        fetchFriendRequests();
    }, [])
    
    const fetchFriendRequests = async ()=>{
        try {
            const response = await axios.get(`${baseURL}/friend-request/${userId}`)
            console.log(response.data)
            const friendRequestsData = response.data.map((friendRequest)=> ({
                _id: friendRequest._id,
                name:friendRequest.name,
                image: friendRequest.image
            }))
            sentFriendRequests(friendRequestsData);

        } catch (error) {
            console.log(error)
        }
    }
 
  return (
    <View style={{padding:10, marginHorizontal:12}}>
        {friendRequests.length > 0 && <Text>Your Friend Requests</Text>}
        {friendRequests.map((user, index)=>{
            <FriendRequest key={index} user={user} friendRequests={friendRequests} sentFriendRequests={sentFriendRequests}></FriendRequest>
        })}
       
    </View>
  )
}

export default FriendsScreen

const styles = StyleSheet.create({})