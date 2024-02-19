import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from "react-native";
// import { StatusBar } from "expo-status-bar";
// import Plane from "../src/Global/images/plane.svg";
//  import Lion from "../src/Global/images/bigger-lion.png";
import FollowUs from "../src/Global/Header";
// import Navbar from "../src/Global/Navbar";
import { Footer } from "../src/Global/Footer";
// import { yellow } from "@mui/material/colors";
import { COLORS } from "../src/Global/Color";
// import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";
import { Link, useNavigation } from "expo-router";
import { firebase, firestore, auth } from "../src/config";
import Icon from "react-native-vector-icons/Entypo";
import {
  Toolbar,
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Badge,
} from "@mui/material";
export default function AboutUs() {
  const amsArr = [];
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const navigation = useNavigation();
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
  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <ScrollView style={{ Width: "100vw", backgroundColor: "white" }}>
      {/* <StatusBar style="auto" /> */}
      <FollowUs />
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
                <Link href="/singin" asChild>
                  <Pressable>
                    <Button color="inherit">Sign in</Button>
                  </Pressable>
                </Link>
                <Link href="/sihnup" asChild>
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
                <Link href="/singin" asChild>
                  <Pressable>
                    <Button color="inherit">Sign in</Button>
                  </Pressable>
                </Link>
                <Link href="/sihnup" asChild>
                  <Pressable>
                    <Button color="inherit">Sign Up</Button>
                  </Pressable>
                </Link>
              </>
            )}
          </View>
        )}
      </Toolbar>
      {/* <Navbar /> */}
      <View
        style={{
          //width: "100vw",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <View
          style={{
            width: "66%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            //backgroundColor: "red",
          }}
        >
          <View>
            <Image
              source={require("../src/Global/images/logo.svg")}
              style={{ width: 120, height: 60, resizeMode: "contain" }}
            />
          </View>
          <View style={styles.aboutTextSection}>
            <Text
              style={{
                color: COLORS.darkBlue,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "2rem",
              }}
            >
              ATTLEGILE MARKETING SOLUTIONS
            </Text>

            <Text style={{ textAlign: "center", paddingTop: 10 }}>
              Welcome to Atlegile Marketing Solutions (Pty) Ltd, where passion,
              purpose, and expertise collide to create exceptional Marketing
              strategies. Our Youth Woman-owned and led Business, based in South
              Africa, was founded in 2015, and we’ve been on an exciting journey
              with our Partners ever since. From ground level to the Digital
              space, we’re committed to building strong Brands, effectively
              Communicating products + service offerings, and transferring our
              Skills to help you engage with the Online Market Successfully.
            </Text>
            <Text style={{ textAlign: "center", paddingTop: 10 }}>
              AMS is dedicated to helping African businesses succeed by
              developing strong brands, marketing their products and services
              effectively, and connecting them with a global customer base. They
              aim to drive sales, increase revenue, and create a lasting impact.
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              paddingTop: 30,
              paddingBottom: 30,
            }}
          >
            <View
              style={{
                height: "auto",
                width: "33%",
                border: "1px solid grey",
                margin: 1,
              }}
            >
              <Text
                style={{
                  color: COLORS.darkBlue,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  paddingTop: 10,
                }}
              >
                WHAT WE OFFER
              </Text>
              <Text style={{ padding: 10, textAlign: "start" }}>
                Ams creates strong influential brands, by applying tailored
                market approaches + using compelling content, to effectively
                communicate, build and manage good relationships with online
                communities. We support ESD + marketing departments and
                agencies.
              </Text>
            </View>
            <View
              style={{
                height: "auto",
                width: "33%",
                border: "1px solid grey",
                margin: 1,
              }}
            >
              <Text
                style={{
                  color: COLORS.darkBlue,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  paddingTop: 10,
                }}
              >
                ABOUT AMS
              </Text>
              <Text style={{ padding: 10, textAlign: "start" }}>
                Atlegile Marketing Solutions (Pty) Ltd is a 360 creative brand
                marketing company that assists African businesses to reach their
                intended audience from online to offline. We are located in
                Pimville, Soweto, and service our partners online.
              </Text>
            </View>
            <View
              style={{
                height: "auto",
                width: "33.5%",
                border: "1px solid grey",
                margin: 1,
              }}
            >
              <Text
                style={{
                  color: COLORS.darkBlue,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  paddingTop: 10,
                }}
              >
                OUR USP
              </Text>
              <Text style={{ padding: 10, textAlign: "start" }}>
                We use a unique strategic brand approach that is coupled with
                creativity, while transferring 8 years of professional quality
                service.
              </Text>
              <Text
                style={{
                  color: "black",
                  textAlign: "center",
                  fontWeight: "medium",
                  fontSize: "1rem",
                  padding: 10,
                  textAlign: "start",
                }}
              >
                #AGILE IS WHAT ATLEGILE IS ABOUT
              </Text>
            </View>
          </View>

          <View
            style={{
              height: "50vh",
              width: "80%",
              // backgroundColor: "red",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Video
              ref={video}
              style={{
                height: "50vh",
                width: "100%",
                alignSelf: "center",
              }}
              source={{
                uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
              }}
              useNativeControls
              resizeMode="contain"
              isLooping
              onPlaybackStatusUpdate={setStatus}
            />
            {/* <Image
            source={require("../src/Global/images/plane.svg")}
            style={{
              minHeight: "70vh",
              minWidth: "100%",
              resizeMode: "contain",
            }}
          /> */}
            <Text style={{ alignSelf: "flex-start" }}>
              Business Research and Youth Development Project
            </Text>
          </View>

          <View style={styles.amsContainer}>
            <Text
              style={{
                // color: COLORS.darkBlue,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.2rem",
                paddingTop: 10,
              }}
            >
              AMS IS GUIDED BY SEVERAL CORE VALURES
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "colunm",
                width: 1020,
                paddingTop: 10,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    alignItems: "cernter",
                    paddingTop: 5,
                    paddingHorizontal: 20,
                    paddingBottom: 5,
                    margin: 5,
                    backgroundColor: COLORS.darkBlue,
                    fontSize: "1.2rem",
                  }}
                >
                  PASSION
                </Text>
                <Text
                  style={{
                    color: "white",
                    alignItems: "cernter",
                    paddingTop: 5,
                    paddingHorizontal: 20,
                    margin: 5,
                    paddingBottom: 5,
                    backgroundColor: COLORS.darkBlue,
                    fontSize: "1.2rem",
                  }}
                >
                  INNOVTION
                </Text>
                <Text
                  style={{
                    color: "white",
                    alignItems: "cernter",
                    paddingTop: 5,
                    paddingHorizontal: 20,
                    margin: 5,
                    paddingBottom: 5,
                    backgroundColor: COLORS.darkBlue,
                    fontSize: "1.2rem",
                  }}
                >
                  GLOBAL CONNECTION
                </Text>
                <Text
                  style={{
                    color: "white",
                    alignItems: "cernter",
                    paddingTop: 5,
                    paddingBottom: 5,
                    paddingHorizontal: 20,
                    margin: 5,
                    backgroundColor: COLORS.darkBlue,
                    fontSize: "1.2rem",
                  }}
                >
                  SOCIAL IMPACT
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    alignItems: "cernter",
                    paddingTop: 5,
                    paddingBottom: 5,
                    paddingHorizontal: 20,
                    margin: 5,
                    // backgroundColor: COLORS.darkBlue,
                    fontSize: "1.2rem",
                  }}
                >
                  SKILLS DEVELOPMENT
                </Text>
                <Text
                  style={{
                    color: "white",
                    alignItems: "cernter",
                    paddingTop: 5,
                    paddingHorizontal: 20,
                    margin: 5,
                    paddingBottom: 5,
                    // backgroundColor: COLORS.darkBlue,
                    fontSize: "1.2rem",
                  }}
                >
                  CREATIVITY
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.amsText}>
            <Text
              style={{
                color: COLORS.darkBlue,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "2rem",
                paddingTop: 20,
                paddingBottom: 30,
              }}
            >
              AMS AIMS TO NOT ONLY HELP BUSINESSES GROW BUT TO ALSO MAKE A
              POSITIVE IMPACT ON SOCIETY BY NUTURING LOCAL TALENT AND FOSTRING
              SUSTAINABLE BUSINESSES GROWTH.
            </Text>
          </View>
        </View>
      </View>

      <Image
        source={require("../src/Global/images/big-lion.svg")}
        style={{
          minHeight: "99vh",
          minWidth: "100%",
          resizeMode: "contain",
          // backgroundColor: "red",
        }}
      />

      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    minWidth: 250,
    maxWidth: 400,
  },
  aboutLogo: {
    marginTop: 100,
  },
  aboutContainer: {
    width: "100%",
    height: "auto",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  aboutHeaderContainer: {
    width: "65%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  aboutTextSection: {
    flexDirection: "column",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  aboutPlane: {
    marginTop: 50,
  },
  plane: {},
  amsContainer: {
    marginTop: 20,
  },
  amsHeader: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 70,
    marginBottom: 30,
    fontSize: 30,
  },
  amsLists: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  amsText: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 50,
  },
  lionImagesContainer: {
    position: "relative",
  },
  bigLion: {},
  lion: {
    width: "100%",
  },
});
