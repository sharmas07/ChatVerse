import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import baseURL from '../base_url'
import { UserContext, UserType } from '../UserContext'

const UserChat = ({ user }) => {
    const {userId, setUserId} = useContext(UserType)
    const [messages, setMessages] = useState([]);
    const formatTime = (timestamp)=>{
        const options = {hour:"numeric", minute:"numeric"};
        return new Date(timestamp).toLocaleString("en-US", options)
    }
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${baseURL}/user/${userId}/${user._id}`) 
            console.log(response.data);
            setMessages(response.data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchMessages();
    }, [])
    const getLastMessage = ()=>{
        const userMsgs = messages.filter((message)=>message.messageType === "text");
        const n = userMsgs.length;
        return userMsgs[n-1];
    }
    const lastMsg = getLastMessage();
    console.log("\n\t",lastMsg)
    const dummyUserUrl = 'https://res.cloudinary.com/duaob0aso/image/upload/v1691231960/userProfile_s3xqnt.png'
    const navigation = useNavigation();
    return (
        <Pressable
        onPress={()=> navigation.navigate("Messages", {
            recepientId: user._id
        })}
        style={{
            flexDirection: "row",
            alignItems: 'center',
            gap: 10,
            borderWidth: 0.7,
            borderColor: "#000",
            borderTopWidth:0,
            borderLeftWidth:0,
            borderRightWidth:0,
            padding:10
        }}>
            <Image style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }} source={{ uri: dummyUserUrl }} />
            <View style={{flex:1}}>
                <Text style={{fontSize:15, fontWeight:"500"}}>{user?.name}</Text>
                {lastMsg && 
                <Text style={{marginTop:3, color:"gray", fontWeight:500}} >{lastMsg?.message}</Text>}
            </View>

            <View>
                <Text style={{fontSize:11, fontWeight:"400", color:"gray"}}>
                    {lastMsg && formatTime(lastMsg?.timeStamp)}
                </Text>
            </View>
        </Pressable>
    )
}

export default UserChat

const styles = StyleSheet.create({})