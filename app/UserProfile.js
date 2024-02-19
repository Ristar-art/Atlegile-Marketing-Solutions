import { View, TouchableOpacity, Image, Text, Modal, StyleSheet,ScrollView, Pressable } from "react-native";
import { Typography, Button } from "@mui/material";
import Icon from "react-native-vector-icons/Fontisto";
import React, { useState, useEffect } from "react";
import FollowUs from "../src/Global/Header";
import Navbar from "../src/Global/Navbar";
import { Footer } from "../src/Global/Footer";
import { useNavigation } from "expo-router";
import sara from "../src/Global/images/Sara.png";
import { firebase } from "../src/config";
import { signOut } from "firebase/auth";
// import { auth } from "react-native-firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, firestore } from "../src/config";
import { Link } from "expo-router";
const UserProfile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [showOrderHistory, setShowOrderHistory] = useState(true);
  const [user, setUser] = useState(null);


  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe(); // Unsubscribe from the auth state listener when component unmounts
    };
  }, []);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = firestore.collection("Users").doc(user.uid);

        // Fetch user details from Firestore
        try {
          const userDoc = await userDocRef.get();
          if (userDoc.exists) {
            setUserData(userDoc.data());
          } else {
            console.error("User document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

 
  const handleOrderHistoryNav = () => {
    navigation.navigate("OrderHistory");
  };

  const handleBusiness = () => {
    navigation.navigate("BusinessRegistration");
    // alert('button clicked!')
  };

 
  return (
    <ScrollView style={styles.container}>
      <FollowUs />
      <Navbar />

      <View
        style={{
          height: "800px",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <View>
          <View
            style={{
              marginTop: 20,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={sara}
              style={{
                width: "180px",
                height: "180px",
                display: "flex",
                alignItems: "center",
                borderRadius: "50%",
                justifyContent: "center",
                // backgroundColor: "red",
              }}
            />
          </View>

          {/* <View
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography style={{ fontWeight: 700 }} variant="h4">
              {userData && userData.name}
            </Typography>
            <Typography style={{ fontWeight: 700 }} variant="h7">
              {userData && userData.phone}
            </Typography>
            <Typography style={{ fontWeight: 700 }} variant="h7">
              {userData && userData.email}
            </Typography>
          </View> */}
          <View
            style={{
              marginTop: 30,
              textAlign: "center",
            }}
          >
            {/* {userData && (
              <View
                style={{
                  marginTop: 30,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6">{userData.location}</Typography>
              </View>
            )} */}
          </View>
          <View
            style={{
              padding: 30,
              marginTop: 30,
              display: "flex",
              marginBottom: "5px",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              style={{ color: "#072840", fontWeight: 600 }}
              variant="h6"
            >
             {userData?.name} {userData?.surname}
            </Typography>
            <Typography style={{ color: "gray", fontWeight: 600 }} variant="h7">
          {userData?.alternativeContact.name}  {userData?.alternativeContact.phone}
            </Typography>
          </View>
          <View>
            <View
              style={{
                border: "none",
                paddingBottom: 10,
                flexDirection: "row",
              }}
            >
              <Icon name="stopwatch" size={18} style={{ marginRight: "5px" }} />
              {/* <TouchableOpacity
                style={{
                  fontSize: 12,
                  color: "gray",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
                onPress={handleOrderHistoryNav}
              >
                <Text>ORDER HISTORY</Text>
              </TouchableOpacity> */}
              <Link href="/Cart/OrderHisrory" asChild>
      <Pressable>
        <Text>ORDER HISTORY</Text>
      </Pressable>
    </Link>
            </View>
            {showOrderHistory && (
              <View>
                {/* Map out order history here */}
                {orderHistory.map((order, index) => (
                  <View key={index}>
                    <Text style={{ color: "black" }}>
                      Product Name: {order.productName}, Purchase Date:{" "}
                      {order.createdAt}, Total: {order.price}
                      {console.log(order.price)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            <View
              style={{
                border: "none",
                display: "flex",
                paddingTop: 10,
                paddingBottom: 10,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Icon name="stopwatch" size={18} style={{ marginRight: "5px" }} />
              
              <Link href="/Favourites/Favourites" asChild>
      <Pressable>
        <Text>FAVOURITES</Text>
      </Pressable>
    </Link>
            </View>
            <View
              style={{
                border: "none",
                display: "flex",
                paddingTop: 10,
                paddingBottom: 10,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Icon name="stopwatch" size={18} style={{ marginRight: "5px" }} />
              <TouchableOpacity
                style={{
                  fontSize: 12,
                  color: "gray",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                <Text>TERMS & CONDITIONS </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                border: "none",
                display: "flex",
                paddingTop: 10,
                paddingBottom: 10,
                marginBottom: "5px",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Icon name="stopwatch" size={18} style={{ marginRight: "5px" }} />
              <TouchableOpacity
                style={{
                  fontSize: 12,
                  color: "gray",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                <Text>PRIVACY POLICY </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Button
              style={{
                color: "#072840",
                marginRight: "5px",
                borderRadius: "20px",
              }}
              variant="outlined"
              onClick={handleBusiness}
            >
              REGISTER BUSINESS
            </Button>
            <Button
              style={{
                color: "#072840",
                borderRadius: "20px",
                outlineColor: "#072840",
                marginRight: "5px",
              }}
              variant="outlined"
            >
              REGISTER AS A TALENT
            </Button>
            <Button
              style={{
                color: "#072840",
                borderRadius: "20px",
                outlineColor: "#072840",
                marginRight: "5px",
              }}
              variant="outlined"
              
              onClick={() => signOut(firebase.auth())}
              >
            
              Sign Out
            </Button>
            <Button
              style={{
                color: "#072840",
                borderRadius: "20px",
                outlineColor: "#072840",
                marginRight: "5px",
              }}
              variant="outlined"
              onClick={() => {
                navigation.navigate("AccountAndBusiness");
              }}
            >
              Manage Business
            </Button>
          </View>
        </View>
      </View>
      <Footer />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
});

export default UserProfile;
