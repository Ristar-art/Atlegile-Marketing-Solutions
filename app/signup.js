import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { firebase, firestore } from "../src/config";
import { router } from "expo-router";
import TextField from "@mui/material/TextField";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigation } from "expo-router";

const Signup = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameAlternative, setNameAlternative] = useState(null);
  const [phoneAlternative, setPhoneAlternative] = useState(null);
  const [loading, setLoading] = useState(false);
  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const window = Dimensions.get("window"); // Getting window dimensions

  const navigateSignUpBussiness = () => {
    router.replace("/BussinessRegistration");
  };

  const navigateToShop = () => {
    navigation.navigate("Landing");
  };

  const navigatealreadyhaveaccount = () => {
    navigation.navigate("SignIn");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      alert("Please fill in all fields before signing in.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      if (userCredential.user) {
        console.log("User signed up:", userCredential.user);
        await firestore
          .collection("Users")
          .doc(userCredential.user.uid)
          .set({
            email: email,
            alternativeContact: {
              name: nameAlternative,
              phone: phoneAlternative,
            },
          });
          router.replace("/TellUsAboutYourself");
        
      }
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert("Error signing up. Please try again.");
    } finally {
      setLoading(false); // Set loading back to false after the sign-up process completes
    }
  };

  // Calculate container width and height dynamically
  const containerWidth = window.width > 400 ? 400 : window.width * 0.9;
  const containerHeight = window.height > 600 ? 600 : window.height * 0.9;

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../src/Global/images/Reed.jpg")}
        style={styles.background}
      >
        <View
          style={{ ...styles.container, width: containerWidth, height: "95%" }}
        >
          <View>
            
          </View>
          <Image
            source={require("../src/Global/images/logo.png")}
            style={styles.logo}
          />
          <View
            style={{
              width: "120%",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Text style={styles.title}>SIGN UP </Text>
            <Link href="/" asChild>
            <Pressable>
              <Text
                style={{ fontSize: 14, marginBottom: -20, fontWeight: "500" }}
              >
                SHOP{" "}
                <AntDesign
                  style={styles.arrow}
                  name="right"
                  size={20}
                  color="#072840"
                />
              </Text>
            </Pressable>
          </Link>
          </View>
          <View style={{ width: "75%" }}>
            <TextField
              id="outlined-number"
              label="Email"
              type="text"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="outlined-number"
              label="Password"
              type="password"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            {loading ? (
              <CircularProgress size={25} />
            ) : (
              <Text style={styles.buttonText}>SIGN UP</Text>
            )}
          </TouchableOpacity>
          <View style={{ width: "70%" }}>
          <Link
            style={{
              position: "relative",
              left: 10,
              marginVertical: 10,
              cursor: "pointer",
              alignSelf: "center",
              fontWeight: "500",
              color: "#072840",
            }}
            href="/signin"
          >
            {" "}
            ALREADY HAVE AN ACCOUNT?
          </Link>
          </View>
          <TouchableOpacity>
            <Text style={styles.linkText1}>
              {" "}
              <AntDesign name="google" size={15} color="red" />
              SIGN UP WITH GOOGLE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.businessButton}
            onPress={navigateSignUpBussiness}
          >
            <Text style={styles.buttonText1}>
              SIGN UP AS A BUSINESS{" "}
              <FontAwesome
                style={styles.arrow}
                name="angle-right"
                size={20}
                color="#072840"
              />
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
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

    margin: "3%",

    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 100,
    marginBottom: 30,
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
  linkText: {
    color: "blue",
    textAlign: "center",
    marginTop: 20,
  },
  linkText1: {
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
  businessButton: {
    borderColor: "#072840",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 10,
    width: "75%",
    alignItems: "center",
  },
  buttonText1: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#072840",
  },
  arrow: {
    marginLeft: 10,
  },
});

export default Signup;