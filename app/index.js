import {
  Redirect,
  Navigator,
  usePathname,
  Slot,
  Link,
  Stack,
} from "expo-router";
//import { View } from "react-native";
import { TabRouter } from "@react-navigation/native";

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import {
  Toolbar,
  Container,
  Typography,
  Grid,
  Button,
  Badge,
} from "@mui/material";
// import { ShoppingCart } from "@mui/icons-material";
import Icon from "react-native-vector-icons/Entypo";

//  import Navbar from "../src/Global/Navbar";
import SearchBar from "../src/Global/SearchBar";
//import ProductCard from "../src/Global/Card";
import FollowUs from "../src/Global/Header";
import { Footer } from "../src/Global/Footer";
//import shop from "../../Global/images/svg_landing.svg";
//import shop2 from "../../Global/images/svg_landing.svg";
import { firebase, firestore, auth } from "../src/config";
// import { useNavigation } from "@react-navigation/native";
import BusinessCard from "../src/Client/BusinessCard";
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

import { Box } from "@mui/material";
// import Icon from "react-native-vector-icons/FontAwesome5";
import Icon2 from "react-native-vector-icons/Feather";
import Icon3 from "react-native-vector-icons/EvilIcons";
import { useNavigation } from "expo-router";
// import { Dimensions } from 'react-native';
function LogoTitle() {
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const isLargeDevice = width > 911;

  const openYouTube = () => {
    navigation.navigate("https://www.youtube.com/");
  };

  useEffect(() => {
    const handleDimensionsChange = ({ window }) => {
      setWidth(window.width);
    };

    Dimensions.addEventListener("change", handleDimensionsChange);

    return () => {
      Dimensions.removeEventListener("change", handleDimensionsChange);
    };
  }, []);

  return (
    <Box
      sx={{
        color: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px",
        paddingHorizontal: 20,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginRight: 2,
        }}
      >
        <Icon2 name="phone" size={16} color="white" />
        <Typography variant="subtitle2">(225) 555-0118</Typography>
      </Box>

      {isLargeDevice && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginRight: 2,
          }}
        >
          <Icon3 name="envelope" size={20} color="white" />
          <Typography variant="subtitle2">
            michelle.rivera@example.com
          </Typography>
        </Box>
      )}

      {isLargeDevice && (
        <Box sx={{ display: "flex", flexDirection: "row", marginRight: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            Follow us and get a chance to win 80% off
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginRight: 2,
        }}
      >
        <Typography>Follow Us : </Typography>
        <Icon
          name="instagram"
          size={16}
          color="white"
          style={{ paddingHorizontal: 10, marginRight: 2 }}
        />
        <Icon
          onPress={openYouTube}
          name="youtube"
          size={16}
          color="white"
          style={{ paddingHorizontal: 10, marginRight: 2 }}
        />
        {isLargeDevice && (
          <>
            <Icon
              name="facebook"
              size={16}
              color="white"
              style={{ paddingHorizontal: 10, marginRight: 2 }}
            />
            <Icon
              name="twitter"
              size={16}
              color="white"
              style={{ paddingHorizontal: 10, marginRight: 2 }}
            />
          </>
        )}
      </Box>
    </Box>
  );
}
const Landing = () => {
  // const navigation = useNavigation();
  const [businesses, setBusinesses] = useState([]);
  const [products, setProducts] = useState([]);
  const scrollViewRef1 = useRef(null);
  const scrollViewRef2 = useRef(null);
  const scrollViewRef3 = useRef(null);
  const navigation = useNavigation();
  const [collectionList, setCollectionList] = useState([]);
  const [firebaseCollection, setFirebaseCollection] = useState(null);
  const imageLogo = require("../assets/logo.png");
  const [userData, setUserData] = useState(null);
  const [cartCount, setCartCount] = useState(2);
  const [showMenu, setShowMenu] = useState(false);
  const [width, setWidth] = useState(Dimensions.get("window").width);
  // const imageLogo = require("../../assets/logo.png");

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const navigateAndCloseMenu = (screen) => {
    console.log("screen is ", screen);
    // navigation.navigate(screen);
    setShowMenu(false);
  };
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const cartCollectionRef = firestore
          .collection("Cart")
          .where("uid", "==", user.uid);

        const unsubscribeCartSnapshot = cartCollectionRef.onSnapshot(
          (snapshot) => {
            const itemCount = snapshot.docs.length;
            setCartCount(itemCount);
          }
        );

        const userDocRef = firestore.collection("Users").doc(user.uid);
        const unsubscribeSnapshot = userDocRef.onSnapshot((doc) => {
          if (doc.exists) {
            setUserData(doc.data());
          } else {
            console.error("User data not found");
          }
        });

        return () => {
          unsubscribeCartSnapshot();
          unsubscribeSnapshot();
        };
      } else {
        setUserData(null);
        setCartCount(0); // Reset cart count when the user is not authenticated
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    const handleDimensionsChange = ({ window }) => {
      setWidth(window.width);
    };

    Dimensions.addEventListener("change", handleDimensionsChange);

    return () => {
      Dimensions.removeEventListener("change", handleDimensionsChange);
    };
  }, []);
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
  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <>
      <ScrollView style={styles.container}>
        <FollowUs />
        {/* <Navbar /> */}
        {/* <Stack.Screen
          options={{
            // https://reactnavigation.org/docs/headers#setting-the-header-title
            title: "My home",
            // https://reactnavigation.org/docs/headers#adjusting-header-styles
            headerStyle: { backgroundColor: "#252b42" },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            // https://reactnavigation.org/docs/headers#replacing-the-title-with-a-custom-component
            headerTitle: (props) => <LogoTitle {...props} />,
          }}
        /> */}
        {/* <Text>Home Screen</Text>
      <Link href={{ pathname: 'About', params: { name: 'Bacon' } }}>Go to About</Link>
  */}
        <Toolbar
          sx={{
            color: "#252B42",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
          //  onPress={() => navigation.navigate("Landing")}
          >
            <Image
              source={imageLogo}
              style={{ width: 120, height: 60, resizeMode: "contain" }}
            />
          </TouchableOpacity>
          {width < 600 ? (
            <TouchableOpacity onPress={toggleMenu}>
              <Icon
                name={showMenu ? "times" : "bars"}
                size={20}
                color="#252B42"
              />
            </TouchableOpacity>
          ) : (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {userData ? (
                <>
                  <Link href="/" asChild>
                    <Pressable>
                      <Button color="inherit">Shop</Button>
                    </Pressable>
                  </Link>

                  <Link href="/About" asChild>
                    <Pressable>
                      <Button color="inherit">About Us</Button>
                    </Pressable>
                  </Link>
                  <Link href="/DateSelectionAndCheckout" asChild>
                    <Pressable>
                      <Box>
                        <Badge
                          badgeContent={cartCount}
                          color="primary"
                          style={{ margin: "0px 15px" }}
                        >
                          <Icon
                            name="shopping-cart"
                            size={20}
                            color="#252B42"
                          />
                          {/* <ShoppingCart
                          color="action"
                          style={{ color: "black" }}
                        /> */}
                        </Badge>
                      </Box>
                    </Pressable>
                  </Link>
                  <Link href="/UserProfile" asChild>
                    <Pressable
                      // onPress={() => navigateAndCloseMenu("UserProfile")}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          backgroundColor: "gray",
                          borderRadius: "8%",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          style={{
                            fontSize: 16,
                            color: "white",
                            padding: 10,
                          }}
                        >
                          AS
                        </Typography>
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Typography variant="subtitle1">
                          Welcome, {userData.name}
                        </Typography>
                        <Typography style={{ fontSize: 12 }}>
                          {userData.username}
                        </Typography>
                      </View>
                    </Pressable>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/" asChild>
                    <Pressable>
                      <Button color="inherit">Shop</Button>
                    </Pressable>
                  </Link>
                  <Link href="/About" asChild>
                    <Pressable color="black">
                      <Button color="inherit">About Us</Button>
                    </Pressable>
                  </Link>
                  <Link href="/signin" asChild>
                    <Pressable>
                      <Button color="inherit">Sign in</Button>
                    </Pressable>
                  </Link>
                  <Link href="/signup" asChild>
                    <Pressable>
                      <Button color="inherit">Sign Up</Button>
                    </Pressable>
                  </Link>
                </>
              )}
            </View>
          )}
          {showMenu && width < 600 && (
            <View
              style={{
                position: "absolute",
                top: 60,
                right: 10,
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 5,
                zIndex: 999,
              }}
            >
              <Link href="/" asChild>
                <Pressable>
                  <Button color="inherit">Shop</Button>
                </Pressable>
              </Link>
              <Link href="/About" asChild>
                <Pressable color="black">
                  <Button color="inherit">About Us</Button>
                </Pressable>
              </Link>
              {userData ? (
                <>
                  <TouchableOpacity
                  // onPress={() => navigateAndCloseMenu("UserProfile")}
                  >
                    <Button color="inherit">Profile</Button>
                  </TouchableOpacity>
                  <TouchableOpacity
                  // onPress={() => navigateAndCloseMenu("DateSelectionAndCheckout")}
                  >
                    <Button color="inherit">Cart</Button>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Link href="/signin" asChild>
                    <Pressable>
                      <Button color="inherit">Sign in</Button>
                    </Pressable>
                  </Link>
                  <Link href="/signup" asChild>
                    <Pressable>
                      <Button color="inherit">Sign Up</Button>
                    </Pressable>
                  </Link>
                </>
              )}
            </View>
          )}
        </Toolbar>
        {/* <Navbar></Navbar> */}
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
