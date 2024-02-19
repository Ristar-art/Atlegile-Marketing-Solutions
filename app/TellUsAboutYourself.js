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
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

const TellUsAboutYourself = ({ navigation }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  //const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const window = Dimensions.get("window");
  const user = firebase.auth().currentUser;

  const handleContinue = async (e) => {
    e.preventDefault();

    if (!name || !surname || !phone || !gender || !email || !location) {
      alert("Please fill in all fields before continuing.");
      return;
    }

    localStorage.setItem("user", user.uid);

    try {
      setLoading(true);
      const userRef = firestore.collection("Users").doc(user.uid);

      await userRef.set({
        name,
        surname,
        phone,
        gender,
        email,
        //location,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid,
      });

      console.log("User information successfully submitted to Firestore.");

      navigation.navigate("AlternativeContact");
    } catch (error) {
      console.error("Error submitting user information:", error.message);
      alert("Error submitting user information. Please try again.");
    } finally {
      setLoading(true);
    }
  };
  const emptyOption = [""];
  const genderOptions = ["Male", "Female", "Other"];
  // Calculate container width and height dynamically
  const containerWidth = window.width > 400 ? 400 : window.width * 0.9;
  const containerHeight = window.height > 600 ? 600 : window.height * 0.9;

  return (
    <ImageBackground
      source={require("../src/Global/images/Reed.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={require("../src/Global/images/logo.png")}
          style={styles.logo}
        />{" "}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "75%",
            flexDirection: "column",
          }}
        >
          {" "}
          <Text style={styles.title}>MAIN ACCOUNT HOLDER</Text>
          <Text style={styles.subtitle}>TELL US ABOUT YOURSELF</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "75%",
          }}
        >
          <TextField
            id="outlined-number"
            label="Name"
            type="text"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "48%",

              marginRight: "5px",
            }}
          />

          <TextField
            id="outlined-number"
            label="Surname"
            type="text"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            style={{
              width: "48%",
              // marginTop: "5px",
              // marginRight: "10px",
              // textAlign: "left",
            }}
          />
        </View>
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
          style={{
            width: "75%",
            marginTop: "5px",
            textAlign: "left",
          }}
        />
        <br />
        <TextField
          id="outlined"
          select
          label="Gender"
          variant="standard"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={{
            width: "75%",
            textAlign: "left",
            marginTop: "10px",
          }}
        >
          {genderOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <br />
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
          style={{
            width: "75%",
            marginTop: "5px",
            textAlign: "left",
          }}
        />
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          {loading ? (
            <CircularProgress size={25} />
          ) : (
            <Text style={styles.buttonText}>CONTINUE</Text>
          )}
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
    height: "95%",
    margin: "3%",

    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 150,
    resizeMode: "contain",
    // marginLeft: "29%",
  },
  title: {
    fontSize: 10,
    marginBottom: 2,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  input: {
    height: 40,
    // marginBottom: 10,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginVertical: 15,
  },
  pickerItem: {
    color: "#072840",
  },
  button: {
    backgroundColor: "#072840",
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 10,
    width: "75%",
    display: "flex",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
  },
});

export default TellUsAboutYourself;