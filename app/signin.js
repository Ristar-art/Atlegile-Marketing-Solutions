import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Pressable
} from "react-native";
import { Link, useNavigation } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import CircularProgress from "@mui/material/CircularProgress"; // This import might cause an issue in a React Native project. Make sure you're using a proper CircularProgress component for React Native.
import { firebase } from "../src/config"; // Assuming firebase import is correct
import { router } from 'expo-router';
const Signin = () => {
  const navigation = useNavigation(); // React Navigation hook for navigation
  const [email, setEmail] = useState(""); // State variable for email input
  const [password, setPassword] = useState(""); // State variable for password input
  const [loading, setLoading] = useState(false); // State variable for loading indicator
  const window = Dimensions.get('window'); // Getting window dimensions
  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  // Function to handle sign-in
  const handleSignin = async () => {
    try {
      setLoading(true); // Set loading state to true
      // Validate email and password
      if (email.trim() === "" || password.trim() === "") {
        alert("Please fill in all fields before signing in.");
        return;
      }
      // Sign in user with email and password
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      if (userCredential.user) {
       
        router.replace("/") // Navigate to Landing screen upon successful sign-in
      }
    } catch (error) {
      console.error("Error signing in:", error.message);
      alert("Error signing in. Please try again."); // Alert user if sign-in fails
    } finally {
      setLoading(false); // Set loading state to false after sign-in attempt
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Add necessary imports and definitions for Google Sign-In here
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      alert("Error signing in with Google. Please try again.");
    }
  };

  const handleShop = () => {
    navigation.navigate("Landing"); // Navigate to Landing screen when user wants to shop
  };

  // Calculate container width and height dynamically
  const containerWidth = window.width > 400 ? 400 : window.width * 0.9;
  const containerHeight = window.height > 600 ? 600 : window.height * 0.9;

  return (
    <ImageBackground
      source={require("../src/Global/images/Reed.jpg")} // Background image
      style={styles.background}>
      <View style={{...styles.container, width: containerWidth, height: "95%"}}>

        {/* Logo image container */}
        <View style={{}}>
          <Image
            source={require("../src/Global/images/logo.png")}
            style={styles.logo}
          />
        </View>

        {/* Sign-in text container */}
        <View style={{ width: "110%", flexDirection: "row", justifyContent: "space-around" }}>
          <Text style={styles.title}>SIGN IN </Text>

          {/* Insert arrow logo */}
          <Link href="/" asChild>
                    <Pressable>
                    <Text style={{ fontSize: 14, marginBottom: -20 ,fontWeight: "500",}}>
              SHOP <AntDesign style={styles.arrow} name="right" size={20} color="#072840" />
            </Text>
                    </Pressable>
                  </Link>
          {/* <TouchableOpacity onPress={handleShop}>
            <Text style={{ fontSize: 14, marginBottom: -20 ,fontWeight: "500",}}>
              SHOP <AntDesign style={styles.arrow} name="right" size={20} color="#072840" />
            </Text>
          </TouchableOpacity> */}
        </View>

        {/* TextInput fields container */}
        <View style={{ width: "75%" }}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
        </View>
        <View style= {{width:"70%",paddingLeft:2}}>
          <Text
            style={{
              position: "relative",
              left: 10,
              marginVertical: 10,
              cursor: "pointer",
              alignSelf:'flex-end',
              fontWeight: "500",
              color: "#072840",
            }}>
            FORGOT PASSWORD?
          </Text>
        </View>

        {/* Sign-in button */}
        <TouchableOpacity style={styles.button} onPress={handleSignin}>
          {loading ? (
            <CircularProgress size={25} /> // Loading indicator
          ) : (
            <Text style={styles.buttonText}>SIGN IN</Text> // Sign-in text
          )}
        </TouchableOpacity>
        <View style= {{width:"70%"}}>
          <TouchableOpacity
          onPress={()=> navigation.navigate('SignUp')}
            style={{
              position: "relative",
              left: 10,
              marginVertical: 10,
              cursor: "pointer",
              alignSelf:'center',
              fontWeight: "500",
              color: "#072840",
            }}>
              
            DON'T HAVE AN ACCOUNT?
          </TouchableOpacity>
        </View>
        {/* Google sign-in button */}
        <TouchableOpacity onPress={handleGoogleSignIn}>
          <Text style={styles.linkText1}>
            <AntDesign name="google" size={15} color="red" /> SIGN UP WITH GOOGLE
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  container: {
    backgroundColor: "#FFFFFF",
  //  padding: 20,
    // borderRadius: 10,
   // width: "30%",
    margin: "3%",
   // height: "95vh",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 50,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "left",
  },
  input: {
    height: 40,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginVertical: 15,
  },
  button: {
    backgroundColor: "#072840",
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 10,
    width: "75%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  linkText1: {
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
  arrow: {
    marginLeft: 10,
  },
});

export default Signin;