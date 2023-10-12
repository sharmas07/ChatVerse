import { Image, StyleSheet, Text, ScrollView, KeyboardAvoidingView, View, TextInput, Pressable } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState, useRef } from 'react'
import { Entypo, Ionicons } from '@expo/vector-icons'
import EmojiSelector from 'react-native-emoji-selector';
import { UserType } from '../UserContext'
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import baseURL from '../base_url';

const ChatMessagesScreen = () => {
    const dummyUserUrl = 'https://res.cloudinary.com/duaob0aso/image/upload/v1691231960/userProfile_s3xqnt.png'
    const navigation = useNavigation();
    const route = useRoute()
    const { recepientId } = route.params
    const [recepientData, setRecepientData] = useState({})
    const { userId, setUserId } = useContext(UserType)
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [Message, setMessage] = useState('');
    const [messages, setMessages] = useState([])
    const scrollViewRef = useRef()

    const scrollToBottom = ()=>{
        if(scrollViewRef.current){
            scrollViewRef.current.scrollToEnd({animated:false})
        }
    }
    useEffect(()=>{
        scrollToBottom()
    })
    const handleContentSizeChange = ()=>{
        scrollToBottom();
    }
    const handleSend = async (messageType, imageUri) => {
        try {
            console.log(recepientId)
            const formData = new FormData();
            formData.append("senderId", userId);
            formData.append("receipentId", recepientId._id);

            if (messageType === "image") {
                formData.append("messageType", "image")
                formData.append("imageFile", {
                    uri: imageUri,
                    name: "image.jpg",
                    type: "image/jpeg"
                })
            }
            else {
                formData.append("messageType", "text")
                formData.append("messageText", Message)
            }
            console.log(Message)
            const response = await axios.post(`${baseURL}/messages`, { messageText: Message, recepientId: recepientId, senderId: userId, messageType: "text" })
            console.log(response)
            if (response) {
                setMessage("")
                fetchMessages();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${baseURL}/user/${userId}/${recepientId}`)
            // console.log(response)
            console.log(response.data);
            setMessages(response.data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchMessages();
    }, [])

    useEffect(() => {
        const fetchRecepientData = async () => {
            try {
                const response = await axios.get(`${baseURL}/user/${recepientId}`)
                console.log(response.data);
                setRecepientData(response.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchRecepientData();
    }, [])
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => {
                return (<View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons onPress={() => navigation.goBack()} name='arrow-back' size={24} color="black" />
                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                        <Image style={{ width: 30, height: 30, borderRadius: 15, resizeMode: "cover" }} source={{ uri: dummyUserUrl }} />
                        <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: 'bold' }}>{recepientData.name}</Text>
                    </View>
                </View>)
            }
        })
    }, [recepientData])
    const formatTime = (timestamp)=>{
        const options = {hour:"numeric", minute:"numeric"};
        return new Date(timestamp).toLocaleString("en-US", options)
    }
    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
            <ScrollView ref={scrollViewRef} contentContainerStyle={{flexGrow:1}} onContentSizeChange={handleContentSizeChange}>
                {/* {All chats messages go here} */}

                {messages.map((item, index) => {
                    if (item.messageType === "text") {
                        return (
                            <Pressable style={[
                                item?.senderId?._id === userId ? { alignSelf: "flex-end", backgroundColor: "#DCF8C6",padding:8, maxWidth:"60%",borderRadius:7,margin:10 } : {alignSelf:"flex-start",backgroundColor:"#fff", padding:8, margin:10, borderRadius:8}
                            ]} key={index}>
                                <Text style={{fontSize:16}}>
                                    {item?.message}
                                </Text>
                                <Text style={{fontSize:11, color:'grey'}}>
                                    {formatTime(item?.timeStamp)}
                                </Text>
                            </Pressable>
                        )
                    }
                })}
            </ScrollView>

            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: "#dddddd", marginBottom: showEmojiSelector ? 0 : 23, paddingTop: 10 }}>

                <Entypo onPress={() => setShowEmojiSelector(!showEmojiSelector)} style={{ marginRight: 5 }} name="emoji-happy" size={24} color="black" />
                <TextInput onChangeText={(text) => setMessage(text)} value={Message} style={{ flex: 1, height: 40, borderWidth: 1, borderColor: "#dddddd", borderRadius: 20, padding: 10 }} placeholder='Type Your message..' />

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginHorizontal: 8 }}>
                    <Entypo name='camera' size={24} color="gray" />
                </View>

                <Pressable onPress={() => handleSend("text")} style={{ width: 60, backgroundColor: '#007bff', paddingVertical: 8, borderRadius: 20, marginLeft: 10 }}>
                    <Text style={{ textAlign: 'center', color: 'white', fontWeight: "bold" }}>Send</Text>
                </Pressable>
            </View>
            {
                showEmojiSelector && <EmojiSelector onEmojiSelected={((emoji) => setMessage((prevMessage) => prevMessage + emoji))} style={{ height: 280 }} />
            }
        </KeyboardAvoidingView>
    )
}

export default ChatMessagesScreen

const styles = StyleSheet.create({})