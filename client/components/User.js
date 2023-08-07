import { StyleSheet, Text, Image, View, Pressable } from 'react-native'
import React,{useContext, useState}  from 'react'
import { UserType } from '../UserContext'
import axios from 'axios'
import baseURL from '../base_url'

const User = ({ user }) => {
    const dummyUserUrl = 'https://res.cloudinary.com/duaob0aso/image/upload/v1691231960/userProfile_s3xqnt.png'
    const {userId, setUserId} = useContext(UserType);
    const [requestSent, setRequestSent] = useState(false);
    async function handleSendFriendRequest(currentUserId, selectedUserId){
        try {
            const response = await axios.post(`${baseURL}/friend-request`, {currentUserId, selectedUserId});
            console.log(response);
            if(response.ok){
                setRequestSent(true)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Pressable style={{
            flexDirection:'row',
            alignItems:'center',
            marginVertical:10
        }}>
            <View>
                <Image style={{ width: 50, height: 50, borderRadius: 25, resizeMode: 'cover' }} source={{ uri: dummyUserUrl }} />
            </View>

            <View style={{marginLeft:12, flex:1}}>
                <Text style={{fontSize:18, fontWeight:'bold'}}>{user.name}</Text>
                
            </View>
            <Pressable onPress={()=>handleSendFriendRequest(userId, user._id)} style={{backgroundColor:"#567189", padding:10, borderRadius:7, width:105}}>
                    <Text style={{color:"#fff", textAlign:'center', fontSize:13}}>
                        Add Friend
                    </Text>
                </Pressable>
        </Pressable>
    )
}

export default User

const styles = StyleSheet.create({})