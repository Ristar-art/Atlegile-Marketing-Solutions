import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import lionImage from "../Global/images/BigLion..png"; // Make sure the path is correct
// import shadowLogo from "../../assets/images/Shadow_Logo.png";

const { width } = Dimensions.get('window');

export function Footer() {
  return (
    <View style={styles.container}>
      <View style={styles.section1}>
        <View style={styles.section1Left}></View>
        <View style={styles.section1Right}>
          {/* <Image source={shadowLogo} style={styles.logo} resizeMode="contain" /> */}
          <Text style={styles.heading}>Marketing Services</Text>
          <Text style={styles.description}>
            Welcome to AMS, where we specialize in building beautiful brands,
            marketing African businesses, and connecting them with a global
            customer base, driving sales of their exceptional products and
            services.
          </Text>
          <Text style={styles.email}>atlegilemarketing.co.za</Text>
        </View>
        <View style={styles.section1Links}>
          <View style={styles.linksContainer}>
            <Text style={styles.link}>ORDER HISTORY</Text>
            <Text style={styles.link}>TERMS & CONDITIONS</Text>
            <Text style={styles.link}>PRIVACY POLICY</Text>
          </View>
        </View>
        <View style={styles.section1Image}></View>
      </View>
      {width > 600 && (
        <View style={styles.section2}>
          <View style={styles.section2TextContainer}>
            <Text style={styles.section2Text}>
              Atlegile Marketing Solutions (Pty) Ltd eCommerce 2023
            </Text>
          </View>
          <View style={styles.section2ImageContainer}>
            <Image
              source={lionImage}
              style={styles.section2Image}
              resizeMode="cover"
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#070F18",
    width: "100%",
    flex: 1,
  },
  section1: {
    flexDirection: "row",
  },
  section1Left: {
    flex: 6,
    padding: 2,
  },
  section1Right: {
    flex: 6,
    padding: 2,
  },
  logo: {
    width: "50%",
    paddingTop: 40,
  },
  heading: {
    fontSize: 15,
    color: "#FFF",
  },
  description: {
    fontSize: 10,
    color: "#FFF",
  },
  email: {
    color: "#FFF",
  },
  section1Links: {
    flex: 6,
    flexDirection: "column",
    justifyContent: "center",
  },
  linksContainer: {
    marginLeft: 20,
  },
  link: {
    color: "#FFF",
  },
  section1Image: {
    flex: 6,
    padding: 2,
  },
  section2: {
    flexDirection: "row",
    alignItems: "center",
  },
  section2TextContainer: {
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  section2Text: {
    textAlign: "center",
    color: "#FFF",
  },
  section2ImageContainer: {
    flex: 2,
    backgroundColor: "#070F18",
    opacity: 0.3,
  },
  section2Image: {
    width: "100%",
    height: 210,
    position: "relative",
    top: -50,
  },
});
