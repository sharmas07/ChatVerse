import { StyleSheet, Text, Image, View, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";
import axios from "axios";
import baseURL from "../base_url";

const User = ({ user }) => {
  const dummyUserUrl =
    "https://res.cloudinary.com/duaob0aso/image/upload/v1691231960/userProfile_s3xqnt.png";
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);

  useEffect(() => {
    const fetchFriendRequest = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/friend-requests/sent/${userId}`
        );
        // console.log(response)
        if (response) {
          setFriendRequests(response.data);
        } else {
          console.log("error", response.status);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchFriendRequest();
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${baseURL}/friends/${userId}`);
        console.log(response);
        if (response) {
          setUserFriends(response.data);
        } else {
          console.log("error", response.status);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFriends();
  }, []);
  async function handleSendFriendRequest(currentUserId, selectedUserId) {
    try {
      const response = await axios.post(`${baseURL}/friend-request`, {
        currentUserId,
        selectedUserId,
      });
      console.log(response);
      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log(error);
    }
  }
  console.log("friend requests sent", friendRequests);
  console.log("user friends", userFriends);

  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
      }}
    >
      <View>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
          }}
          source={{ uri: dummyUserUrl }}
        />
      </View>

      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{user.name}</Text>
      </View>

      {userFriends.includes(item._id) ? (
        <Pressable
          style={{
            backgroundColor: "#82cd47",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Friends</Text>
        </Pressable>
      ) : requestSent ||
        friendRequests.some((friend) => friend._id === item._id) ? (
        <Pressable
          style={{
            backgroundColor: "gray",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Request Sent
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => handleSendFriendRequest(userId, user._id)}
          style={{
            backgroundColor: "#000",
            padding: 10,
            borderRadius: 7,
            width: 105,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 13 }}>
            Add Friend
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({});
