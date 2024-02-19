import React, { useState, useEffect } from "react";
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
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Breadcrumbs,
  Link,
  Container,
  Grid,
  TextField,
  Avatar,
  CardMedia,
  Snackbar,
  Skeleton,
  CardContent,
  Card,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
//import logo from "../../Global/images/logo.png";
//import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import image from "../../Global/images/fixed-height.png";
// import CreditCardIcon from "@mui/icons-material/CreditCard";
import Rating from "@mui/material/Rating";
// import StarIcon from "@mui/icons-material/Star";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import fixed from "../../Global/images/fixed-height.png";
// import yellow from "../../Global/images/headphones.png";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Feather";
//import { useNavigation } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import ReviewsCard from "../../src/Client/ReviewsCard";
//import Card from "../../Global/Card2";
import { router } from "expo-router";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import firebaseConfig from "../../src/config";
import { firebase, auth } from "../../src/config";

import Navbar from "../../src/Global/Navbar";
import { useLocalSearchParams,useGlobalSearchParams } from "expo-router";
import FollowUs from "../../src/Global/Header";
export default function ProductDetails() {
  
const { productId } = useGlobalSearchParams();

 console.log('my productId is', productId)
 const {businessName}= useLocalSearchParams();
 console.log('businessName is ',businessName)
  const [myRatings, setMyRatings] = useState(2.5);
  const [product, setProduct] = useState(null);

  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showSnackbar1, setShowSnackbar1] = useState(false);
  const [isRed, setIsRed] = useState(false);
  const user = firebase.auth().currentUser;

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleChangeProduct = (relatedProductId) => {
    // Navigate to the new product's details page
    navigation.navigate('ProductDetails', { productId: relatedProductId });
  };

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
          image: product.images[0],
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

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login first");
      return navigation.navigate("SignIn");
    }
    try {
      const cartCollectionRef = collection(firestore, "Cart");

      // Add a new document with user information, product ID, product price, quantity, and image
      await addDoc(cartCollectionRef, {
        uid: user.uid,
        productId: productId,
        price: product.price,
        name: product.name,
        quantity: quantity,
        image: product.images[currentImage],
        timestamp: serverTimestamp(),
      });

      console.log("Item added to the cart!");
      navigation.navigate("DateSelectionAndCheckout");
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const reviewsCollectionRef = doc(firestore, "Reviews", productId);
      const reviewsCollectionSnapshot = await getDoc(reviewsCollectionRef);

      if (reviewsCollectionSnapshot.exists()) {
        const reviewsData = reviewsCollectionSnapshot.data();
        console.log("Fetched reviews data:", reviewsData);
        setReviews(reviewsData.reviews || []);
      } else {
        console.log("Reviews collection not found for product:", productId);
        setReviews([]);
      }
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [firestore, productId]);

  // ... (your existing code)

  const handleReviewPost = async () => {
    try {
      // Get the reference to the Reviews document
      const reviewsCollectionRef = doc(firestore, "Reviews", productId);

      // Check if the document exists
      const reviewsCollectionSnapshot = await getDoc(reviewsCollectionRef);

      if (reviewsCollectionSnapshot.exists()) {
        // If the document exists, update it
        await updateDoc(reviewsCollectionRef, {
          reviews: [
            ...reviews,
            {
              myRatings,
              productId,
              review,
            },
          ],
        });
      } else {
        // If the document does not exist, create a new one
        await setDoc(reviewsCollectionRef, {
          reviews: [
            {
              myRatings,
              productId,
              review,
            },
          ],
        });
      }

      // Fetch the updated reviews
      fetchReviews();

      // Clear the review input
      setReview("");
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  if (!productId) {
    // Handle the case where productId is not provided
    return <Typography>No Product ID provided</Typography>;
  }

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productDocRef = doc(firestore, "Products", productId);
        const productDocSnapshot = await getDoc(productDocRef);

        if (productDocSnapshot.exists()) {
          const productData = productDocSnapshot.data();
          console.log("Fetched product data:", productData);
          setProduct(productData);
        } else {
          console.log("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false); // Set loading to false after data fetching is complete
      }
    };

    fetchProductData();
  }, [firestore, productId]);

   useEffect(() => {
    //console.log('product.businessName is ',product)
    const fetchProducts = async () => {
      const cartCollectionRef = collection(firestore, "Products");
      const q = query(
        cartCollectionRef,
        where("businessName", "==", businessName),
        limit(4) // Set the limit to 4 products
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
        setRelatedProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProducts();
  }, []); // Adjust the dependency to include only necessary variables
  
  const handleSnackbarClose1 = () => {
    setShowSnackbar1(false);
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  if (loading) {
    // Render a loading state using Skeleton
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginRight: "50vh",
          minHeight: "100vh", // Set minimum height to occupy the full viewport height
        }}
      >
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Skeleton
            variant="rectangular"
            width="40%"
            animation="wave"
            height={540}
          />
          <Skeleton variant="text" width="50%" height={35} />
          {/* Add more Skeleton components as needed for your design */}
        </Container>
        <Container
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            // backgroundColor: "red",
            position: "relative",
            alignSelf: "left",
            alignItems: "left",
            width: "30%",
            left: -90,
          }}
        >
          <Skeleton
            variant="text"
            width="70%"
            height={80}
            style={{ marginLeft: "2%" }}
          />
          <Skeleton
            variant="text"
            width="70%"
            height={80}
            style={{ marginLeft: "2%" }}
          />
          <Skeleton
            variant="text"
            width="70%"
            height={80}
            style={{ marginLeft: "2%" }}
          />
        </Container>
      </Box>
    );
  }

  if (!product) {
    // Render a message or handle the case where product is not available
    return <Typography>No Product Found</Typography>;
  }

  // // Assuming the images are stored in an array field named 'images'

  // const reviews = [
  //   {
  //     id: "XYZ123abc456def789",
  //     createdAt: "2023-01-01T12:00:00Z",
  //     comment: "This is a test comment for the product.",
  //     userName: "John",
  //     userSurname: "Doe",
  //     userID: "ghIJKL123mnoPQR456",
  //     productID: "78PQRstUvwXYZ90abc",
  //     role: "Photographer",
  //     ratings: 4.0,
  //   },
  //   {
  //     id: "PQrs56tuVW78xyZ90",
  //     createdAt: "2023-01-02T12:00:00Z",
  //     comment: "Another test comment for the product.",
  //     userName: "Jane",
  //     userSurname: "Smith",
  //     userID: "stuvwX789YZabc012D",
  //     productID: "78PQRstUvwXYZ90abc",
  //     role: "Designer",
  //     ratings: 3.5,
  //   },
  //   {
  //     id: "ABcde12FGhijk34LMno",
  //     createdAt: "2023-01-03T12:00:00Z",
  //     comment: "Yet another test comment for the product.",
  //     userName: "Bob",
  //     userSurname: "Johnson",
  //     userID: "EFGhi123JKLMno456",
  //     productID: "78PQRstUvwXYZ90abc",
  //     role: "Carpenter",
  //     ratings: 5.0,
  //   },
  // ];

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const handlePrev = () => {
    setCurrentImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const handleThumbnailClick = (index) => {
    setCurrentImage(index);
  };

  return (
    <ScrollView style={{backgroundColor: "white"}}>
    <FollowUs/>
      <Navbar />
      <Box sx={{ height: "100%", overflowY: "auto" }}>
        <Container maxWidth="md">
          <Box sx={{ pl: 2, pb: 2, backgroundColor: "white" }}>
            <Breadcrumbs>
              <Link
                color="inherit"
                href="/"
                sx={{ fontSize: 15, textDecoration: "none" }}
              >
                Home
              </Link>
              <Link
                color="inherit"
                href="/vaas"
                sx={{ fontSize: 15, textDecoration: "none" }}
              >
                VAAS
              </Link>
              <Typography
                color="textPrimary"
                sx={{ fontSize: 15, textDecoration: "none" }}
              >
                Digital Marketing Solutions Mbali
              </Typography>
            </Breadcrumbs>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", mb: 10 }}>
            {/*START - Left side Panel */}
            <Box
              sx={{
                height: "100%",
                width: "50%",
                //border: "1px lightgray solid",
                borderRadius: 2,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <IconButton
                  onClick={handlePrev}
                  sx={{ position: "absolute", top: "50%", left: "5px" }}
                >
                  <ArrowBackIosIcon />
                </IconButton>
                <img
                  src={product.images[currentImage]}
                  alt={`image-${currentImage}`}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    backgroundColor: "blue",
                  }}
                />
                <IconButton
                  onClick={handleNext}
                  sx={{ position: "absolute", top: "50%", right: "5px" }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: "flex", mt: 1 }}>
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`thumbnail-${index}`}
                    onClick={() => handleThumbnailClick(index)}
                    style={{
                      width: "60px",
                      height: "60px",
                      marginRight: 10,
                      border: "1px solid red",
                      opacity: index === currentImage ? 1 : 0.5,
                    }}
                  />
                ))}
              </Box>
            </Box>
            {/*END - Left side Panel */}

            {/*START - Right side Panel*/}
            <Box
              sx={{
                height: "100%",
                width: "50%",
                pl: 2,
              }}
            >
              <Box
                sx={{
                  //border: "1px red solid",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  // onClick={() => navigation.navigate("/main/dashboard")}
                  sx={{
                    border: "1px #072840 solid",
                    borderRadius: 20,
                  }}
                >
                  <Typography
                    sx={{ fontWeight: "600", fontSize: 10, color: "#072840" }}
                  >
                    PHYSICAL
                  </Typography>
                </Button>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: "600", fontSize: 20 }}>
                    {product.name}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography>{product.description}</Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ fontWeight: "600" }}>
                    R{product.price}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ fontWeight: "600", color: "lightgray" }}>
                    Quantity
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Grid container sx={{ mt: 2, width: "50%", p: 1 }}>
                    <Grid
                      item
                      xs={2}
                      onClick={decreaseQuantity}
                      sx={{
                        //border: "1px red solid",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <RemoveIcon />
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      sx={{
                        //border: "1px red solid",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {quantity}
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      onClick={increaseQuantity}
                      sx={{
                        //border: "1px red solid",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AddIcon />
                    </Grid>
                  </Grid>
                  <Button
                    onClick={handleAddToCart}
                    sx={{
                      backgroundColor: "#072840",
                      borderRadius: 20,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 15, color: "white", pl: 1, pr: 1 }}
                    >
                      ADD TO CART
                    </Typography>
                  </Button>
                </Box>
                <Box
                  sx={{
                    borderLeft: "10px red solid",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 3,
                    }}
                  >
                    <Box
                      onClick={increaseQuantity}
                      sx={{
                        //border: "1px #d32f2f solid",
                        pr: 2,
                      }}
                    >
                      <Avatar sx={{ backgroundColor: "#d32f2f", p: 1 }}>
                        <CreditCardOutlinedIcon sx={{ color: "white" }} />
                      </Avatar>
                    </Box>

                    <Box
                      onClick={decreaseQuantity}
                      sx={
                        {
                          //border: "1px red solid",
                        }
                      }
                    >
                      <Typography sx={{ fontWeight: "600" }}>
                        Digital Product
                      </Typography>
                      <Typography sx={{ mt: "1" }}>
                        Please note that you will receive this product in your
                        email
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Typography
                  sx={{ fontWeight: "600", fontSize: 15, mt: 3, mb: 4 }}
                >
                  REVIEWS
                </Typography>
                <Box>
                  {reviews.map((review) => (
                    <ReviewsCard key={review.id} review={review} />
                  ))}
                </Box>
                <Box sx={{}}>
                  <Rating
                    name="hover-feedback"
                    value={myRatings}
                    precision={0.5}
                    onChange={(event, newValue) => {
                      setMyRatings(newValue);
                    }}
                  />
                  <TextField
                    fullWidth
                    id="review"
                    label="Write a review"
                    variant="standard"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    fullWidth
                    sx={{
                      textDecoration: "none",
                      border: "none",
                      backgroundColor: "#072840",
                      fontWeight: "500",
                      color: "white",
                      width: "100%",
                      borderRadius: 20,
                      fontSize: 15,
                      p: 1,
                    }}
                    onClick={handleReviewPost}
                    variant="filled"
                  >
                    REVIEW
                  </Button>
                </Box>
              </Box>
            </Box>
            {/*END - Right side Panel*/}
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "600", fontSize: 20, mt: 3, mb: 4 }}>
              RELATED PRODUCTS
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography sx={{ fontWeight: "600", fontSize: 15, mb: 2 }}>
                {product.company}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  margin: 2,
                  //  justifyContent: 'space-around',
                }}
              >
                {relatedProducts &&
                  relatedProducts.map((relatedProduct) =>
                    productId !== relatedProduct.id ? (
                      <Card
                        key={relatedProduct.id}
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
                                relatedProduct.images &&
                                relatedProduct.images.length > 0
                                  ? relatedProduct.images[0]
                                  : "../../assets/image/headsets.png"
                              }
                              alt={relatedProduct.name}
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
                            
                            <Snackbar // Container
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
                              <TouchableOpacity
                                onPress={() => toggleHeart(relatedProduct)}
                              >
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
                                onPress={() => addToCart(relatedProduct)}
                                disabled={!relatedProduct}
                              >
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
                           
                          </Box>
                          <View
                            style={{
                              width: "100%",
                              justifyContent: "space-between",
                              marginTop: "5%", // Adjust as needed
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
                                  {relatedProduct.selectedProductCategory}
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
                                    ⭐{" "}
                                    <Text style={{ color: "white" }}> 4.9</Text>
                                  </Text>
                                </View>
                              </View>

                              <Typography variant="h5" component="h5">
                                {relatedProduct.name &&
                                  relatedProduct.name.slice(0, 20)}
                                {relatedProduct.name &&
                                relatedProduct.name.length < 50
                                  ? ""
                                  : "..."}
                              </Typography>
                              <Typography
                                variant="subtitle2"
                                component="p"
                                style={{ color: "gray" }}
                              >
                                {relatedProduct.description &&
                                  relatedProduct.description.slice(0, 50)}
                                {relatedProduct.description &&
                                relatedProduct.description.length < 50
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
                                  <Icon2 name="download" size={20} />{" "}
                                  {relatedProduct.quantity} Sales
                                </Typography>
                                <View
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
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
                                    R{relatedProduct.price}
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
                                    R{relatedProduct.price}
                                  </Typography>
                                </View>
                              </Box>
                            </View>

                            <Pressable
                              style={{
                                border:"2px black solid",
                                alignSelf:"flex-start",
                                paddingHorizontal:'5px',
                                borderRadius:'50px',
                                marginBottom:15,
                                color:'black',
                                cursor: "pointer",
                              }}

                              onPress={()=>router.push(
                                {
                                  pathname:"ProductDetails/[ProductDetails]",
                                  params:{productId: relatedProduct.id}
                                }
                               )}
                              // onClick={() =>
                              //   handleChangeProduct(relatedProduct.id)
                              // }
                            >
                              
                             <Text>VIEW </Text> 
                              <Icon name="arrow-right" size={20} />
                             
                            </Pressable>
                          </View>
                        </View>
                      </Card>
                    ) : null
                  )}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </ScrollView>
  );
}
