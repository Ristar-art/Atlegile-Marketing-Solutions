import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Pressable,
  ScrollViewBase,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";

import { Footer } from "../../src/Global/Footer";
  import Navbar from "../../src/Global/Navbar";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardMedia,
  CardContent,
  Snackbar,
} from "@mui/material";
import FollowUs from "../../src/Global/Header";
//import Card2 from "../../Global/Card2";
import sara from "../../src/Global/images/Sara.png";
import MuiAlert from "@mui/material/Alert";

import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Feather";
import Skeleton from "@mui/material/Skeleton";
// import Icon1 from "react-native-vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import { auth, firestore } from "../../src/config";
//import { auth, firestore, storage } from "../../config";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import { Link, useNavigation } from "expo-router";

const Favourites = ({ item }) => {
  const [checkOrder, setCheckOrder] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cartData, setCartData] = useState([]);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [isRed, setIsRed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showSnackbar1, setShowSnackbar1] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1080); // Adjust the breakpoint as needed
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe(); // Unsubscribe from the auth state listener when component unmounts
    };
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      console.log("userData is", userData);
      if (!user) {
        console.error("User not authenticated.");
        return;
      }

      const cartCollectionRef = collection(firestore, "Favourites");
      const q = query(cartCollectionRef, where("uid", "==", user.uid));

      try {
        const querySnapshot = await getDocs(q);

        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push(doc.data());
        });
        console.log("productsData is ", productsData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [userData]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = firestore.collection("Users").doc(user.uid);

        try {
          // Fetch user details from Firestore
          const userDoc = await userDocRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserData(userData);
          } else {
            console.error("User document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const fetchCartData = async () => {
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    const cartCollectionRef = collection(firestore, "Cart");
    const q = query(cartCollectionRef, where("uid", "==", user.uid));

    try {
      const querySnapshot = await getDocs(q);

      const cartItems = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        cartItems.push({
          id: doc.id,
          product: data.product,
          quantity: data.quantity,
          amount: data.price * data.quantity,
          image: data.image,
          name: data.name,
          orderId: data.productId,
          timestamp: data.timestamp.toDate(),
          // Add other relevant fields from your Cart collection
        });
      });

      setCartData(cartItems);
      console.log("Cart Data : ", cartData);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    // Fetch cart data when the user is authenticated
    if (user) {
      fetchCartData();
    }
  }, [user]);

  const handlePress = () => {
    Swal.fire({
      icon: "info",
      title: "Contact Information",
      html: "<b>Name:</b> Julian James<br/><b>Phone Number:</b> 0123456789",
      confirmButtonText: "Close",
    });
  };

  const handleSignOut = () => {
    Swal.fire({
      title: "Are you sure you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sign me out!",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/landing-page");
      }
    });
  };

  const handleorders = () => {
    setCheckOrder(true);
  };

  const handlefavorites = () => {
    navigate("/termsandconditions");
  };
  const handleterms = () => {
    navigate("/termsandconditions");
  };

  const handlepolicy = () => {
    navigate("/privacypolicy");
  };

  useEffect(() => {
    console.log("Product Data:", products);
    setLoading(false); // Add this line to set loading to false
  }, [products]);

  const toggleHeart = async () => {
    try {
      const favCollectionRef = firestore.collection("Favourites");
      const favDocRef = favCollectionRef.doc(productId);

      const favDoc = await favDocRef.get();

      if (favDoc.exists) {
        // Document exists, remove from Favourites
        await favDocRef.delete();
        setIsRed(false);
      } else {
        // Document does not exist, add to Favourites
        await favDocRef.set({
          productId: productId,
          uid: uid,
          productName: product.name,
          description: product.description,
          price: product.price,
          // serverTimestamp: firestore.FieldValue.serverTimestamp(),
          businessName: product.businessName,
          company: product.company,
          brand: product.brand,
          // Add other relevant fields
        });
        setIsRed(true);
        setShowSnackbar(true);
      }
    } catch (error) {
      console.error("Error toggling heart:", error);
    }
  };

  const addToCart = async () => {
    try {
      const cartCollectionRef = firestore.collection("Cart");
      await cartCollectionRef.add({
        uid: uid,
        productId: productId,
        description: product.description,
        price: product.price,
        name: product.name,
        quantity: 1,
        image:
          product.images && product.images.length > 0 ? product.images[0] : "",
        // Add other relevant fields
      });
      setShowSnackbar1(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  const handleSnackbarClose1 = () => {
    setShowSnackbar1(false);
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  if (loading) {
    // Render a loading state using Skeleton
    return (
      <Card className="card-container">
        <Skeleton
          variant="rectangular"
          width={270}
          height={270}
          animation="wave"
        />
        <CardContent>
          <Skeleton variant="text" width={100} height={20} animation="wave" />
          <Skeleton variant="text" width={200} height={16} animation="wave" />
          <Skeleton variant="text" width={200} height={16} animation="wave" />
          <Skeleton variant="text" width={80} height={14} animation="wave" />
        </CardContent>
      </Card>
    );
  }
  return (
    <ScrollView style={{flex:1}}>
      <FollowUs />
      <Navbar />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "white",
        }}
      >
        {!isMobile && (
          <View
            style={{
              paddingLeft: 30,
              backgroundColor: "whitesmoke",
              alignItems: "flex-start",
            }}
          >
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              paddingRight={2}
            >
              <View
                elevation={3}
                style={{
                  padding: "20px",
                  height: "100%",
                  width: "300px",
                  margin: "auto",
                  backgroundColor: "whitesmoke",
                }}
              >
                <Box textAlign="center">
                  <img
                    src={sara}
                    alt="User Image"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      marginTop: "80%",
                    }}
                  />
                  <Box sx={{ marginTop: "10%" }}>
                    <Typography variant="h6">
                      {userData?.name} {userData?.surname}
                    </Typography>
                    <Typography variant="subtitle1">
                      {userData?.phone}
                    </Typography>
                    <Typography variant="subtitle2">
                      {userData?.email}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography sx={{ textAlign: "center" }}>
                    {userData?.location}
                  </Typography>
                </Box>

                <Box style={{ marginTop: "50%" }}>
                  <Ionicons name="ios-timer-outline" size={15} color="gray" />
                  <Link href="/Cart/OrderHisrory" asChild>
                    <Pressable>
                      <Text>ORDER HISTORY</Text>
                    </Pressable>
                  </Link>
                </Box>

                <Box>
                  <Ionicons name="ios-timer-outline" size={15} color="gray" />
                  <Button
                    style={{ marginLeft: 5, color: "gray" }}
                    onClick={handlefavorites}
                  >
                    Favorites
                  </Button>
                </Box>

                <Box>
                  <Ionicons name="ios-timer-outline" size={15} color="gray" />
                  <Button
                    style={{ marginLeft: 5, color: "gray" }}
                    onClick={handleterms}
                  >
                    Terms and Conditions
                  </Button>
                </Box>

                <Box sx={{}}>
                  <Ionicons name="ios-timer-outline" size={15} color="gray" />
                  <Button
                    style={{ marginLeft: 5, color: "gray" }}
                    onClick={handlepolicy}
                  >
                    Privacy Policy
                  </Button>
                </Box>

                <Box
                  sx={{
                    marginTop: "40px",
                    backgroundColor: "rgba(266, 255, 255, 0.9)",
                    textAlign: "center",
                    padding: {
                      xs: "10px",
                      sm: "20px",
                    },
                  }}
                >
                  <Button
                    sx={{
                      fontWeight: "bolder",
                      color: "black",
                      marginTop: "10%",
                    }}
                    onClick={handlePress}
                  >
                    Julian James
                  </Button>

                  <Button sx={{ color: "gray", mt: 1, marginTop: "10%" }}>
                    Alternative Contact
                  </Button>
                </Box>

                <Box textAlign="center" marginTop="10%">
                  <Button onClick={handleSignOut} style={{ color: "red" }}>
                    SIGN OUT
                  </Button>
                </Box>
              </View>
            </Box>
          </View>
        )}
        {isMobile && (
          <Box style={{ textAlign: "center", padding: "10px" }}>
            <Ionicons
              name="ios-menu"
              size={30}
              color="black"
              onClick={toggleDropdown}
            />
          </Box>
        )}
        {isMobile && showDropdown && (
          <Box
            style={{
              position: "absolute",
              top: "60px", // Adjust the top position as needed
              right: "20px",
              backgroundColor: "whitesmoke",
              padding: "10px",
              zIndex: 999,
            }}
          >
            {/* Your dropdown content here */}
            <Box textAlign="center">
              <img
                src={sara}
                alt="User Image"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  marginTop: "80%",
                }}
              />
              <Box sx={{ marginTop: "10%" }}>
                <Typography variant="h6">
                  {userData?.name} {userData?.surname}
                </Typography>
                <Typography variant="subtitle1">{userData?.phone}</Typography>
                <Typography variant="subtitle2">{userData?.email}</Typography>
              </Box>
            </Box>
            <Box>
              <Typography sx={{ textAlign: "center" }}>
                {userData?.location}
              </Typography>
            </Box>

            <Box style={{ marginTop: "50%" }}>
              <Ionicons name="ios-timer-outline" size={15} color="gray" />
              <Button
                style={{ marginLeft: 5, color: "gray" }}
                onClick={handleorders}
              >
                Orders
              </Button>
            </Box>

            <Box>
              <Ionicons name="ios-timer-outline" size={15} color="gray" />
              <Button
                style={{ marginLeft: 5, color: "gray" }}
                onClick={handlefavorites}
              >
                Favorites
              </Button>
            </Box>

            <Box>
              <Ionicons name="ios-timer-outline" size={15} color="gray" />
              <Button
                style={{ marginLeft: 5, color: "gray" }}
                onClick={handleterms}
              >
                Terms and Conditions
              </Button>
            </Box>

            <Box sx={{}}>
              <Ionicons name="ios-timer-outline" size={15} color="gray" />
              <Button
                style={{ marginLeft: 5, color: "gray" }}
                onClick={handlepolicy}
              >
                Privacy Policy
              </Button>
            </Box>

            <Box
              sx={{
                marginTop: "40px",
                backgroundColor: "rgba(266, 255, 255, 0.9)",
                textAlign: "center",
                padding: {
                  xs: "10px",
                  sm: "20px",
                },
              }}
            >
              <Button
                sx={{
                  fontWeight: "bolder",
                  color: "black",
                  marginTop: "10%",
                }}
                onClick={handlePress}
              >
                Julian James
              </Button>

              <Button sx={{ color: "gray", mt: 1, marginTop: "10%" }}>
                Alternative Contact
              </Button>
            </Box>

            <Box textAlign="center" marginTop="10%">
              <Button onClick={handleSignOut} style={{ color: "red" }}>
                SIGN OUT
              </Button>
            </Box>
            {/* Add the rest of your dropdown components */}
          </Box>
        )}
        <ScrollView>
          <Typography
            variant="h4"
            style={{
              fontWeight: "bold",
              marginTop: "20px",
              marginBottom: "40px",
              padding: "10px",
            }}
          >
            FAVOURITES
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              margin: 2,
              //  justifyContent: 'space-around',
            }}
          >
            {products.map((product, index) => (
              <Card
                key={product.id}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "45%",
                    md: "35%",
                    lg: "35%",
                  },
                  margin: 2,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: "5%", // Adjust as needed
                    paddingTop: 10,
                  }}
                >
                  <Box
                    style={{
                      borderRadius: "16px",
                      objectFit: "cover",
                      position: "relative",
                      backgroundColor: "whitesmoke",
                      width: "250px",
                      height: "250px",
                      borderRadius: "50%",
                      alignself: "center",
                      justifyContent: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignSelf: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={
                        product.image && product.image.length > 0
                          ? product.image
                          : "../../assets/image/headsets.png"
                      }
                      alt={product.name}
                      style={{
                        position: "relative",
                        borderRadius: "100px",
                        objectFit: "cover",
                        width: 220,
                        height: 220,
                        alignSelf: "center",
                      }}
                    />
                    <Box
                      style={{
                        backgroundColor: "#E74040",
                        position: "absolute",
                        bottom: 200,
                        padding: 2,
                        width: "22%",
                        borderRadius: "8%",
                        alignSelf: "center",
                      }}
                    >
                      <Typography
                        variant="h5"
                        style={{ color: "#fff", textAlign: "center" }}
                      >
                        sale
                      </Typography>
                    </Box>
                    {/* <Container> */}
                    <Snackbar
                      open={showSnackbar}
                      autoHideDuration={3000} // Adjust as needed
                      onClose={handleSnackbarClose}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }} // Set position to top center
                    >
                      <MuiAlert
                        onClose={handleSnackbarClose}
                        severity="success"
                        sx={{ width: "100%" }}
                      >
                        Product added to favorites!
                      </MuiAlert>
                    </Snackbar>
                    <Box
                      style={{
                        paddingHorizontal: 10,
                        position: "absolute",
                        bottom: 30,
                        left: 80,
                        width: "6vw",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignSelf: "center",
                      }}
                    >
                      <TouchableOpacity>
                        <Icon
                          name={isRed ? "heart" : "heart-o"}
                          size={20}
                          style={{
                            padding: 10,
                            backgroundColor: "white",
                            borderRadius: "50%",
                          }}
                          onClick={toggleHeart}
                          color={isRed ? "red" : "black"}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={addToCart}>
                        <Snackbar
                          open={showSnackbar1}
                          autoHideDuration={3000} // Adjust as needed
                          onClose={handleSnackbarClose1}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }} // Set position to top center
                        >
                          <MuiAlert
                            onClose={handleSnackbarClose1}
                            severity="success"
                            sx={{ width: "100%" }}
                          >
                            Product added to Cart!
                          </MuiAlert>
                        </Snackbar>
                        <Icon
                          name="shopping-cart"
                          size={20}
                          style={{
                            padding: 10,
                            backgroundColor: "white",
                            borderRadius: "50%",
                          }}
                          color="black"
                        />
                      </TouchableOpacity>
                    </Box>

                    {/* </Container> */}
                  </Box>
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      marginTop: "5%",
                      //  backgroundColor:'red',
                      // height: "25vh",
                    }}
                  >
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          //     backgroundColor:'green',
                          flexWrap: "wrap",
                        }}
                      >
                        <Text
                          style={{
                            flex: 1,
                            fontSize: "15px",
                            color: "#4FC3F7",
                            fontWeight: "bold",
                          }}
                        >
                          {product.selectedProductCategory}
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#072840",
                            paddingHorizontal: 5,
                            paddingVertical: 3,
                            borderRadius: 15,
                          }}
                        >
                          <Text style={{}}>
                            ⭐ <Text style={{ color: "white" }}> 4.9</Text>
                          </Text>
                        </View>
                      </View>

                      <Typography variant="h5" component="h5">
                        {product.name && product.name.slice(0, 20)}
                        {product.name && product.name.length < 50 ? "" : "..."}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        component="p"
                        style={{ color: "gray" }}
                      >
                        {product.description &&
                          product.description.slice(0, 50)}
                        {product.description && product.description.length < 50
                          ? ""
                          : "..."}
                      </Typography>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="body2"
                          component="p"
                          style={{ color: "gray" }}
                        >
                          <Icon2 name="download" size={20} /> 15 Sales
                        </Typography>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                          <Typography
                            variant="subtitle2"
                            component="p"
                            style={{
                              color: "#BDBDBD",
                              fontSize: "18px",
                              fontWeight: "700",
                              marginRight: "10px",
                            }}
                          >
                            R{product.price}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            component="p"
                            style={{
                              color: "rgb(97, 151, 97)",
                              fontSize: "18px",
                              fontWeight: "700",
                            }}
                          >
                            R{product.price}
                          </Typography>
                        </View>
                      </Box>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </Box>
        </ScrollView>
      </View>
      <Footer />
    </ScrollView>
  );
};
export default Favourites;
