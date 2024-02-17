import React from "react";
import { View,ScrollView } from "react-native";
import { Container, Typography, Button } from "@mui/material";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import FollowUs from "../src/Global/Header";
// import Navbar from "../../Global/Navbar";
import { Footer } from "../src/Global/Footer";
// import { ScrollView } from "react-native-gesture-handler";

const Reciept = () => {
  const navigation = useNavigation();

  const navigateToLanding = () => {
    // {alert("button clicked")}
    navigation.navigate("Landing");
  };

  return (
    <ScrollView style={{flex:1}}>
        
        <FollowUs />
      {/* <Navbar /> */}
      <Container fixed sx={{ height: "85vh" }}>
        <View
          style={{
            height: "800px",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}>
          <View>
            <Icon
              name="checkbox-outline"
              size={190}
              style={{
                marginTop: "20px",
                color: "#66BB6A",
                marginBottom: "10px",
              }}
            />
          </View>
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            THANK YOU FOR YOUR PURCHASE!
          </Typography>
          <Typography style={{ fontWeight: "bold", marginTop: "40px" }}>
            Your order has been successfully placed, and we appreciate your
            trust in our products/services.
          </Typography>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}>
            <Typography style={{ marginTop: "40px" }}>
              Order Details:
            </Typography>
            <Typography>Order Number: #ABC246</Typography>
            <Typography>Date: 11 DEC 2023</Typography>
            <Typography>Total Amount: R4500.00</Typography>
          </View>
          <Typography
            style={{
              fontWeight: "bold",
              marginBottom: "40px",
              marginTop: "40px",
            }}>
            Our team is working diligently to process and ship your order. If
            you have any questions or <br /> concerns, our customer support team
            is here to help. Contact us at 0123456789
          </Typography>

          <Button
            style={{ borderRadius: "40px", backgroundColor: "#072840" }}
            variant="contained"
            onClick={navigateToLanding}>
            CONTINUE SHOPPING
          </Button>
        </View>
      </Container>
      <Footer />
      
    </ScrollView>
  );
};

export default Reciept;
