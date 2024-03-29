import React, { useEffect, useState } from "react";
import { Button, Toolbar, Typography, Box, Badge } from "@mui/material";
// import { useNavigation } from "@react-navigation/native";
import { View, Image, TouchableOpacity, Dimensions, Pressable } from "react-native";
//import Icon from "react-native-vector-icons/FontAwesome5";
import { auth, firestore } from "../config";
import Icon from "react-native-vector-icons/Entypo";
import { Link } from "expo-router";

// ... (previous imports)

const Navbar = () => {
 // const navigation = useNavigation();
  const imageLogo = require("../../assets/logo.png");
  const [userData, setUserData] = useState(null);
  const [cartCount, setCartCount] = useState(2);
  const [showMenu, setShowMenu] = useState(false);
  const [width, setWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    const handleDimensionsChange = ({ window }) => {
      setWidth(window.width);
    };

    Dimensions.addEventListener("change", handleDimensionsChange);

    return () => {
      Dimensions.removeEventListener("change", handleDimensionsChange);
    };
  }, []);

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

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const navigateAndCloseMenu = (screen) => {
    console.log("screen is ", screen);
    // navigation.navigate(screen);
    setShowMenu(false);
  };

  return (
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
  );
};

export default Navbar;
