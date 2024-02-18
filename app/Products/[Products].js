import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import {
  Container,
  Typography,
  Grid,
  Button,
  Card,
  Box,
  CardMedia,
  Snackbar,
  CardContent,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useLocalSearchParams,router ,useNavigation,useGlobalSearchParams} from "expo-router";
//import { Link, router } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Feather";
import Skeleton from "@mui/material/Skeleton";
//import Navbar from "../../Global/Navbar";
import SearchBar from "../../src/Global/SearchBar";
//import ProductCard from "../../Global/Card";
import FollowUs from "../../src/Global/Header";
import { Footer } from "../../src/Global/Footer";
//import shop from "../../Global/images/svg_landing.svg";
//import shop2 from "../../Global/images/svg_landing.svg";
import { firebase, firestore, auth } from "../../src/config";
// import { useNavigation } from "@react-navigation/native";

import { AntDesign } from "@expo/vector-icons";
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  collection,
  onSnapshot,
  Timestamp,
  FieldPath,
} from "firebase/firestore";
// import BusinessCard from "../Landing/BusinessCard";

import { useRoute } from "@react-navigation/native";
const Products = () => {
  const { id } = useGlobalSearchParams();
  console.log("id is ", id);
  // const navigation = useNavigation();
  const [businesses, setBusinesses] = useState([]);
  const [products, setProducts] = useState([]);
  const scrollViewRef1 = useRef(null);
  const scrollViewRef2 = useRef(null);
  const scrollViewRef3 = useRef(null);
  // const route = useRoute();
  const businessName = id ;
  const [collectionList, setCollectionList] = useState([]);
  const [firebaseCollection, setFirebaseCollection] = useState(null);
  //   const navigation = useNavigation();
  const [isRed, setIsRed] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showSnackbar1, setShowSnackbar1] = useState(false);
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const navigateProductDetails = (productId) => {
    // navigation.navigate("ProductDetails", { productId });
  };

  const toggleHeart = async (product) => {
    try {
      if (!product || !product.id) {
        console.error("Product or product ID is undefined", product);
        return;
      }

      const favCollectionRef = firestore.collection("Favourites");
      const favDocRef = favCollectionRef.doc(product.id);

      const favDoc = await favDocRef.get();

      if (favDoc.exists) {
        // Document exists, remove from Favourites
        await favDocRef.delete();
        setIsRed(false);
      } else {
        // Document does not exist, add to Favourites
        await favDocRef.set({
          productId: product.id,
          uid: uid,
          productName: product.name,
          description: product.description,
          price: product.price,
          businessName: product.businessName,
          company: product.company,
          brand: product.brand,
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : "",
        });
        setIsRed(true);
        setShowSnackbar(true);
      }
    } catch (error) {
      console.error("Error toggling heart:", error);
    }
  };

  const addToCart = async (product) => {
    try {
      if (!product || !product.id) {
        console.error("Product or product ID is undefined", product);
        return;
      }

      const cartCollectionRef = firestore.collection("Cart");
      await cartCollectionRef.add({
        uid: uid,
        productId: product.id,
        description: product.description,
        price: product.price,
        name: product.name,
        quantity: 1,
        image:
          product.images && product.images.length > 0 ? product.images[0] : "",
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

  const navigatebusinessproduct = () => {
    navigation.navigate("BusinessProducts");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const cartCollectionRef = collection(firestore, "Products");
      const q = query(
        cartCollectionRef,
        where("businessName", "==", businessName)
      );

      try {
        const querySnapshot = await getDocs(q);

        const productsData = [];
        querySnapshot.forEach((doc) => {
          // Get the document ID and data
          const productWithId = { id: doc.id, ...doc.data() };
          productsData.push(productWithId);
        });

        console.log("productsData is ", productsData);
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product data:", error);
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
    <>
      <ScrollView style={{ backgroundColor: "white" }}>
        <FollowUs />
        {/* <Navbar /> */}
        <SearchBar />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            margin: 2,
          }}
        >
          {products.map((product) => (
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
                      product.images && product.images.length > 0
                        ? product.images[0]
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
                  <Snackbar
                    open={showSnackbar}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
                    <TouchableOpacity onPress={() => toggleHeart(product)}>
                      <Icon
                        name={isRed ? "heart" : "heart-o"}
                        size={20}
                        style={{
                          padding: 10,
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                        color={isRed ? "red" : "black"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => addToCart(product)}
                      disabled={!product}
                    >
                      <Snackbar
                        open={showSnackbar1}
                        autoHideDuration={3000}
                        onClose={handleSnackbarClose1}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
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
                </Box>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    marginTop: "5%",
                  }}
                >
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
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
                        <Text>
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
                      {product.description && product.description.slice(0, 50)}
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
                        <Icon2 name="download" size={20} /> {product.quantity}{" "}
                        Sales
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
                  <Pressable
                    style={{
                      border: "2px black solid",
                      alignSelf: "flex-start",
                      paddingHorizontal: "5px",
                      borderRadius: "50px",
                      marginBottom: 15,
                      color: "black",
                      cursor: "pointer",
                    }}
                    // onPress={()=>router.push(
                    //   {
                    //     pathname:"ProductDetails/[ProductDetails]",
                    //     params:{productId: product.id}
                    //   }
                    //  )}
                    // onPress={()=>router.push(
                    //   {
                    //     pathname:"ProductDetails/[ProductDetails]",
                    //     params:{id: product.id}
                    //   }
                    //  )}
                    // onClick={() => navigateProductDetails(product.id)}
                  >
                    VIEW <Icon name="arrow-right" size={20} />
                  </Pressable>
                </View>
              </View>
            </Card>
          ))}
        </Box>
        <Footer />
      </ScrollView>
    </>
  );
};

export default Products;
