import { useState } from "react";
import {
  Grid,
  TextField,
  Box,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import background from "../src/Global/images/Reed.jpg";
import logo from "../src/Global/images/logo.svg";
// import Banner from "../../Global/images/media bg-cover.png";
import placeholder from "../src/Global/images/login.jpg";
import { useNavigation } from "expo-router";
import {
  Linking,
  ScrollView,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, firestore, storage } from "../src/config";
import firebase from "firebase/compat/app";
// import ImageCompressor from "image-compressor";

const AddProductsAndServices = () => {
  const navigation = useNavigation();

//   const navigatepaymentinfo = () => {
//     navigation.navigate("AddProductsAndServices");
//   };

  const emptyOption = [""];
  const [images, setImages] = useState([]);

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [selectedProductCategory, setProductCategory] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const [brand, setBrand] = useState("");
  const [length,setLength] = useState (null)
  const [width,setWidth] = useState(null)
  const [height,setHeight] = useState(null)
  const [weight,setWeight]= useState(null)
  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const productCategory = [
    ...emptyOption,
    "Electronics",
    "Clothing and Apparel",
    "Home and Furniture",
    "Beauty and Personal Care",
    "Sports and Outdoors",
    "Toys and Games",
    "Books and Stationery",
    "Health and Wellness",
    "Automotive",
    "Grocery and Gourmet",
    "Jewelry and Watches",
    "Home Improvement",
    "Pet Supplies",
    "Office Supplies",
    "Music and Instruments",
    "Garden and Outdoor Living",
    "Art and Craft Supplies",
    "Travel and Luggage",
    "Baby and Maternity",
    "Electrical and Lighting",
  ];

  const url = "https://atlegile-marketing-solutions.vercel.app/";

  const handlePaymentButtonPress = () => {
    const paymentUrl = `https://sandbox.payfast.co.za/eng/process?merchant_id=10000100&merchant_key=46f0cd694581a&return_url=${url}/&cancel_url=${url}/&notify_url=https://atlegilemarketing.firebaseapp.com/&amount=3170.00&item_name=TestProduct`;

    Linking.openURL(paymentUrl);
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };
  const handleContinue = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    try {
      setLoading(true);

      const productRef = firestore.collection("Products").doc();

      const productId = productRef.id;

      await productRef.set({
        name,
        company: companyName,
        businessName,
        price,
        quantity,
        description,
        selectedProductCategory,
        brand,
        height: parseFloat(height),  // Parse input as a float
      length: parseFloat(length),  // Parse input as a float
      width: parseFloat(width),    // Parse input as a float
      weight: parseFloat(weight),  // Parse input as a float
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      const uploadTasks = images.map((image, index) => {
        const imageRef = storage.ref(
          `product_images/${productId}/image${index}`
        );
        return imageRef.put(image.file);
      });

      await Promise.all(uploadTasks);
      const downloadURLs = await Promise.all(
        uploadTasks.map((task) => task.snapshot.ref.getDownloadURL())
      );

      await productRef.update({ images: downloadURLs });

 

      setTimeout(() => {
        setLoading(true);
      }, 3000);
      const paymentUrl = `https://sandbox.payfast.co.za/eng/process?merchant_id=10000100&merchant_key=46f0cd694581a&return_url=${url}/&cancel_url=${url}/&notify_url=${url}/&amount=270.00&item_name=subscription`;
      Linking.openURL(paymentUrl);
      navigation.navigate("Landing");
    } catch (error) {
      console.error("Error storing data in Firestore:", error);
      setLoading(false);
    }
  };

  return (
    <View
    style={{
      width: "100vw",
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      height: "100vh",
    }}
  >
    <Grid
      container
      style={{
        width: "100%",
        marginBottom: "-10vh",
        position: "absolute",
        top: 5,
        left: -10,
        right: 10,
      }}
    >
      <Grid
        item
        lg={8}
        md={8}
        sm={{ hidden: true }}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Left grid content */}
      </Grid>

      <Grid
        item
        lg={4}
        md={4}
        style={{
          backgroundColor: "#fff",
          marginLeft: "-10px",
          width: "100%",
          height: "98vh",
          alignSelf: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Grid style={{ alignSelf: "center" }}>
        
            <img
              src={logo}
              style={{ height: "9vh", width: "90%", paddingTop: "8vh" }}
            />
        
        </Grid>

        <View
          className="form-container"
          style={{
            justifyContent: "center",
            textAlign: "left",
            alignItems: "center",
            width: "75%",
            marginLeft: "80px",
            marginBottom: "30px",
          }}
        >
          <Typography
            variant="h2"
            style={{
              color: "#000",
              textAlign: "left",
              fontSize: "15px",
              width: "100%",
              fontWeight: "bold",
              marginBottom: 1,
            }}
          >
            ADD PRODUCTS + SERVICES
          </Typography>
          <View
                  className="uploadContainer"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "8vh",
                  }}
                >
                  {images.length > 0 ? (
                    images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Product Image ${index + 1}`}
                        style={{
                          padding: "15px",
                          marginRight: "10px",
                          width: "16%",
                          height: "8vh",
                        }}
                      />
                    ))
                  ) : (
                    <img
                      src={placeholder}
                      alt="Placeholder"
                      style={{
                        padding: "5px",
                        marginRight: "10px",
                        width: "16%",
                        height: "8vh",
                      }}
                    />
                  )}

                  <label
                    htmlFor="imageInput"
                    className="add"
                    style={{
                      backgroundColor: "whitesmoke",
                      color: "#000",
                      padding: "25px",
                      // paddingBottom:'20px',
                      width: "5%",
                      cursor: "pointer",
                      alignSelf: "center",
                    }}
                  >
                    +
                  </label>
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                    multiple // Allow selecting multiple files
                  />
                </View>
          <View style={{ alignSelf: "center" }}>
              <form onSubmit={handleContinue}>
                <TextField
                  fullWidth
                  id="outlined-number"
                  label="Name"
                  type="text"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ width: "100%" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <ScrollView>
                  <TextField
                    fullWidth
                    id="outlined-number"
                    label="Business Name"
                    type="text"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{ width: "100%", marginTop: "10px" }}
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                  <TextField
                    id="outlined-number"
                    label="company name"
                    type="text"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{
                      width: "100%",
                      marginTop: "10px",
                    }}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <TextField
                      fullWidth
                      id="outlined-number"
                      label="Price"
                      type="number"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{
                        width: "45%",
                        marginRight: "10px",
                        marginTop: "10px",
                      }}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      id="outlined-number"
                      label="Quantity"
                      type="number"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{ width: "45%", marginTop: "10px" }}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <TextField
                      fullWidth
                      id="outlined-number"
                      label="length_cm"
                      type="number"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{
                        width: "45%",
                        marginRight: "10px",
                        marginTop: "10px",
                      }}
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      id="outlined-number"
                      label="width_cm"
                      type="number"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{ width: "45%", marginTop: "10px", marginRight: "10px",}}
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      id="outlined-number"
                      label="height_cm"
                      type="number"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{ width: "45%", marginTop: "10px" ,marginRight: "10px",}}
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      id="outlined-number"
                      label="weight_kg"
                      type="number"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{ width: "45%", marginTop: "10px" }}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                    />
                  </View>
                  <br />
                  <TextField
                    fullWidth
                    id="outlined-number"
                    label="Description"
                    type="text"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{
                      width: "100%",
                      marginBottom: "10px",
                      marginTop: "10px",
                    }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <TextField
                    fullWidth
                    id="outlined-select-currency"
                    select
                    label="product Category"
                    variant="standard"
                    value={selectedProductCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    style={{
                      width: "100%",
                      marginRight: "10px",
                      textAlign: "left",
                    }}
                    required>
                    {productCategory.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    id="outlined-number"
                    label="Brand"
                    type="text"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{
                      width: "100%",
                      marginLeft: "5px",
                      marginTop: "10px",
                    }}
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  />
                </ScrollView>
                <Button
                  variant="contained"
                  style={{
                    width: "100%",
                    height: "10%",
                    marginTop: "5%",
                    background: "#072840",
                    borderRadius: "30px",
                  }}
                  type="submit">
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems:"center" }}>
                      <CircularProgress color="inherit"  size={25}/>
                    </Box>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>
            </View>
          
          {/* <Button
            variant="contained"
            style={{
              width: "100%",
              height: "10%",
              marginTop: "5%",
              background: "#072840",
              borderRadius: "30px",
            }}
            type="submit"
          >
            {loading ? (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress color="inherit" size={25} />
              </View>
            ) : (
              "Continue"
            )}
          </Button> */}
        </View>
      </Grid>
    </Grid>
  </View>
  );
};

export default AddProductsAndServices;
