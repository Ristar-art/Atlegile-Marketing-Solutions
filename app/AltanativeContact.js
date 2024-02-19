import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { firebase, firestore } from "../src/config";
import TextField from "@mui/material/TextField";
import { useNavigation } from "react-native";
import CircularProgress from "@mui/material/CircularProgress";
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome

const AlternativeContact = () => {
  const user = firebase.auth().currentUser;
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading
  const window = Dimensions.get("window"); // Getting window dimensions
  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const handleContinue = async (e) => {
    e.preventDefault();

    if (name.trim() === "" || phone.trim() === "") {
      alert("Please fill in all fields before continuing.");
      return;
    }

    try {
      setLoading(true); // Set loading to true when the request starts

      const userRef = firestore.collection("Users").doc(user.uid);

      // Get the existing user data
      const userData = await userRef.get();

      // Update the user data with alternative contact information
      await userRef.set(
        {
          alternativeContact: {
            name: name,
            phone: phone,
          },
        },
        { merge: true }
      );

      navigation.navigate("Landing");

      console.log(
        "Alternative contact information submitted to 'Users' collection in Firestore."
      );
    } catch (error) {
      console.error(
        "Error submitting alternative contact information:",
        error.message
      );
    } finally {
      setLoading(false); // Set loading to false when the request completes
    }
  };

  const handleNotNow = () => {
    console.log("Not Now button clicked");
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
            <Text style={styles.title}>ALTERNATIVE CONTACTS</Text>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              id="outlined-number"
              label="Phone"
              type="text"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </View>
          <TouchableOpacity style={styles.button}  onPress={handleContinue}>
            {loading ? (
              <CircularProgress size={25} />
            ) : (
              <Text style={styles.buttonText}>CONTINUE</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.businessButton}
            onPress={handleContinue}
          >
            <Text style ={styles.buttonText1}>
              NOT NOW
              
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

export default AlternativeContact;