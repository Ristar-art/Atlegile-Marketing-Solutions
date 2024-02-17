import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Container, Typography, Grid, Button } from "@mui/material";
// import Navbar from "../src/Global/Navbar";
import SearchBar from "../../src/Global/SearchBar";
//import ProductCard from "../src/Global/Card";
import FollowUs from "../../src/Global/Header";
import { Footer } from "../../src/Global/Footer";
//import shop from "../../Global/images/svg_landing.svg";
//import shop2 from "../../Global/images/svg_landing.svg";
import { firebase, firestore, auth } from "../../src/config";
// import { useNavigation } from "@react-navigation/native";
import BusinessCard from "../../src/Client/BusinessCard";
//import { AntDesign } from "@expo/vector-icons";
// import {
//   setDoc,
//   doc,
//   getDoc,
//   getDocs,
//   addDoc,
//   query,
//   where,
//   collection,
//   onSnapshot,
//   Timestamp,
//   FieldPath,
// } from "firebase/firestore";

const Landing = () => {
  // const navigation = useNavigation();
  const [businesses, setBusinesses] = useState([]);
  const [products, setProducts] = useState([]);
  const scrollViewRef1 = useRef(null);
  const scrollViewRef2 = useRef(null);
  const scrollViewRef3 = useRef(null);

  const [collectionList, setCollectionList] = useState([]);
  const [firebaseCollection, setFirebaseCollection] = useState(null);

  const navigatebusinessproduct = () => {
    // navigation.navigate("BusinessProducts");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const productsRef = firebase.firestore().collection("Products");

      try {
        const snapshot = await productsRef.get();
        const collection = [];
        const productsData = snapshot.docs.map((doc) => ({
          // id: doc.id,
          ...doc.data(),
        }));
        productsData.map((item) => collection.push(item.company));
        // setProducts(productsData);
        console.log("collection", new Set(collection));
        // alert('products fetched')
        setBusinesses([...new Set(collection)]);
        console.log("businesses : ", businesses);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const scrollLeft = (scrollViewRef) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, animated: true });
    }
  };

  const scrollRight = (scrollViewRef) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <FollowUs />
        {/* <Navbar /> */}
        
        <SearchBar />
        <container
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            // backgroundColor: "red",
            // position: "relative",
          }}
        >
          <Grid
            item
            xl={12}
            // lg={12}
            style={{
              alignItems: "right",
              justifyContent: "right",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                margin: "30px 50px",
                fontSize: "34px",
              }}
            >
              EXPLORE
            </Text>
          </Grid>

          <Grid item style={{ marginTop: "20px" }}>
            <button
              style={{
                width: "78px",
                height: "78px",
                borderRadius: "150px",
                textAlign: "center",
                border: "3px solid gold",
                margin: "5px",
                backgroundColor: "black",
                color: "#fff",
              }}
            >
              <Text style={{ color: "#FFF" }}>Buy</Text>
            </button>
            <button
              style={{
                width: "78px",
                height: "78px",
                borderRadius: "150px",
                textAlign: "center",
                border: "3px solid gold",
                margin: "5px",
                backgroundColor: "black",
                color: "#fff",
              }}
            >
              <Text style={{ color: "#FFF" }}>Sell</Text>
            </button>
            <button
              style={{
                width: "78px",
                height: "78px",
                borderRadius: "150px",
                textAlign: "center",
                border: "3px solid gold",
                margin: "5px",
                backgroundColor: "black",
                color: "#fff",
              }}
            >
              <Text style={{ color: "#FFF" }}>Support</Text>
            </button>
          </Grid>
        </container>
        <View>
          <FlatList
            data={businesses}
            keyExtractor={(item) => item}
            renderItem={({ item }) => <BusinessCard business={item} />}
          />
        </View>
        <Grid
          container
          style={{
            width: "100%",
            height: "auto",

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid
            item
            xl={6}
            lg={8}
            md={8}
            sm={10}
            xs={10}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                width: "66vw",
              }}
            >
              <View
                style={{
                  margin: 5,
                  height: "auto",
                  width: "32vw",
                  padding: 5,
                }}
              >
                <Typography
                  variant="h4"
                  style={{
                    fontWeight: "bolder",
                    justifySelf: "center",
                    paddingTop: "4vh",
                  }}
                >
                  AFRICA'S BUSINESS <br /> SUPPORT
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    flexWrap: "wrap",
                  }}
                >
                  High Impact Enterprises + Skills Development Solutions
                </Typography>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginVertical: "15px",
                  }}
                >
                  <button
                    style={{
                      borderRadius: "15px",
                      color: "#fff",
                      backgroundColor: "#000",
                      marginRight: "5px",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingLeft: 3,
                      paddingRight: 3,
                    }}
                  >
                    SHOP
                  </button>
                  <button
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      paddingLeft: 3,
                      paddingRight: 3,
                      borderRadius: "15px",
                    }}
                  >
                    ABOUT US
                  </button>
                </View>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  width: "32vw",
                }}
              >
                <View
                  style={{
                    border: "1px solid orange",
                    padding: 5,
                    marginRight: 5,
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{ fontSize: "12px", fontSize: "10px" }}
                  >
                    soWhereTo <br /> Township Business
                    <br />
                  </Typography>
                  <Typography style={{ color: "orange" }}>
                    VIEW PROJECT
                  </Typography>
                </View>
                <View
                  style={{
                    border: "1px solid orange",
                    padding: 5,
                    marginRight: 5,
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{ fontSize: "12px", fontSize: "10px" }}
                  >
                    soWhereTo <br /> Youth Training
                    <br />
                  </Typography>
                  <Typography style={{ color: "orange" }}>
                    VIEW PROJECT
                  </Typography>
                </View>
                <View
                  style={{
                    border: "1px solid orange",
                    padding: 5,
                    marginRight: 5,
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{ fontSize: "12px", fontSize: "10px" }}
                  >
                    soWhereTo <br /> @HUB Support <br />
                  </Typography>
                  <Typography style={{ color: "orange" }}>
                    VIEW PROJECT
                  </Typography>
                </View>
              </View>
            </View>
          </Grid>
        </Grid>
        <Footer />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
});

export default Landing;
