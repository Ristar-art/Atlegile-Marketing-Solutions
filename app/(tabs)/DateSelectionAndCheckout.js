import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Card,
  ImageList,
  ImageListItem,
  TextField,
} from "@mui/material";
import { useNavigation } from "@react-navigation/native";
import FollowUs from "../../src/Global/Header";
// import Navbar from "../../Global/Navbar";
import { Footer } from "../../src/Global/Footer";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firestore } from "../../src/config";

import {
  collection,
  query,
  doc,
  getDoc,
  where,
  getDocs,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";

import { auth } from "../../src/config";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const DateSelectionAndCheckout = () => {
  const navigation = useNavigation();
  const [orderTotal, setOrderTotal] = useState(0);
  const [tax, setTax] = useState(null);
  const [agentReferral, setAgentReferral] = useState(0);
  const [deliveryAmount, setDeliveryAmount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [cartData, setCartData] = useState([]);
  const [user, setUser] = useState(null);
  const [rates, setRates] = useState([]);
  const [cartCount, setCartCount] = useState(2);
  const [newArr, setNewArr] = useState([]);
  const [userData, setUserData] = useState(null);
  const [addressInput, setAddessInput] = useState(false);
  const mapRef = useRef(null);
  const [address, setAddress] = useState({});
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState({
    lat: -26.2609931,
    lng: 27.9502322,
  });
  const [theBusinessName, setTheBusinessName] = useState("");
  const [trackingRef, setTrackingRef] = useState("");
  const [shipmentStatus, setShipmentStatus] = useState("");
  const [location, setLocation] = useState("");
  const [isPicked, setIsPicked] = useState(false);
  const [driver, setDriver] = useState("");
  const [totalLength, setTotalLength] = useState(0);
  const [totalWidth, setTotalWidth] = useState(0);
  const [totalHeight, setTotalHeight] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [addressCard, setAddressCard] = useState(false);
  const [fixedAddress, setFixedAddress] = useState({});
  const [editedValue, setEditedValue] = useState("");
  const [editStreetAdress, setEditStreetAdress] = useState(false);
  const [editCity, setEditCity] = useState(false);
  const [editZone, setEditZone] = useState(false);
  const [editLocalArea, setEditLocalArea] = useState(false);
  const [editCode, setEditCode] = useState(false);
  const [editCounty, setEditCountry] = useState(false);

  // useEffect hook to listen for changes in authentication state
  useEffect(() => {
    // Get the authentication instance
    const auth = getAuth();

    // Subscribe to the authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Update the state with the current user
      setUser(user);
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      unsubscribe(); // Unsubscribe from the auth state listener when component unmounts
    };
  }, []);

  // using local host URL for now which routes back to the initial screen but when hosted we will use the host URL
  const url = "http://localhost:19006";
  // const url2 = "https://atlegile-marketing-solutions.vercel.app/Reciept";

  // Function to fetch cart data for the authenticated user
  const fetchCartData = async () => {
    // Check if the user is authenticated
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    // Reference to the 'Cart' collection in Firestore
    const cartCollectionRef = collection(firestore, "Cart");

    // Query to get the cart items for the current user
    const q = query(cartCollectionRef, where("uid", "==", user.uid));

    try {
      // Get a snapshot of the query results
      const querySnapshot = await getDocs(q);

      // Arrays to store cart items and cart products separately
      const cartItems = [];
      const cartProducts = [];

      // Iterate through each document in the query snapshot
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Add cart item details to the 'cartItems' array
        cartItems.push({
          id: doc.id,
          product: data.product,
          quantity: data.quantity,
          amount: data.price * data.quantity,
          image: data.image,
          name: data.name,
          // Add other relevant fields from your Cart collection
        });

        // Add cart product details to the 'cartProducts' array
        cartProducts.push({
          id: doc.id,
          productId: data.productId,
          timestamp: data.timestamp,
          quantity: data.quantity,
          amount: data.price * data.quantity,
          image: data.image,
          name: data.name,
          length: data.length,
          width: data.width,
          height: data.height,
          weight: data.weight,
          // Add other relevant fields from your Cart collection
        });
      });

      // Set the state with the fetched cart items and cart products
      setCartData(cartItems);
      setNewArr(cartProducts);

      console.log("cartData: ", cartData);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  // Effect hook to fetch cart data when the user is authenticated
  useEffect(() => {
    // Check if the user is authenticated
    if (user) {
      // Call the fetchCartData function to retrieve cart data
      fetchCartData();
    }
  }, [user]); // Trigger the effect whenever the user changes

  // Effect hook to fetch company data based on the first product in the cart
  useEffect(() => {
    // Function to fetch company data
    const fetchCompanyData = async () => {
      // Reference to the 'Products' collection in Firestore
      const cartCollectionRef = collection(firestore, "Products");

      // Arrays to store dimensions and weight for all products
      const allLengths = [];
      const allWidths = [];
      const allHeights = [];
      const allWeights = [];

      // Iterate through each product in the cart
      for (const product of newArr) {
        const docId = product.productId;

        // Get a reference to the document using the productId
        const docRef = doc(cartCollectionRef, docId);

        // Fetch the document snapshot
        const docSnapshot = await getDoc(docRef);

        // Check if the document exists
        if (docSnapshot.data()) {
          // Extract relevant data from the document
          const length = docSnapshot.data().length;
          const width = docSnapshot.data().width;
          const height = docSnapshot.data().height;
          const weight = docSnapshot.data().weight;

          // Add dimensions and weight to the arrays
          allLengths.push(length);
          allWidths.push(width);
          allHeights.push(height);
          allWeights.push(weight);
        } else {
          console.log("Document not found.");
        }
      }

      // Calculate the sum of dimensions and weight
      const sumLength = allLengths.reduce((acc, val) => acc + val, 0);
      const sumWidth = allWidths.reduce((acc, val) => acc + val, 0);
      const sumHeight = allHeights.reduce((acc, val) => acc + val, 0);
      const sumWeight = allWeights.reduce((acc, val) => acc + val, 0);

      setTotalLength(sumLength);
      setTotalWidth(sumWidth);
      setTotalHeight(sumHeight);
      setTotalWeight(sumWeight);
    };

    // Ensure that newArr is defined before invoking fetchCompanyData
    if (newArr.length > 0) {
      fetchCompanyData();
    }
  }, [newArr]);

  useEffect(() => {
    // Calculate the total amount of all items in the cart
    const totalAmount = cartData.reduce((acc, item) => acc + item.amount, 0);

    // Calculate the referral amount as 10% of the total amount
    const calculatedReferral = totalAmount * 0.1;

    // Set the calculated referral amount in the component state
    setAgentReferral(calculatedReferral);

    // Calculate the final order total by adding the total amount, referral amount, tax, and delivery amount
    const finalTotal = totalAmount + calculatedReferral + tax + deliveryAmount;

    // Set the final order total in the component state
    setOrderTotal(finalTotal);
  }, [cartData, tax, deliveryAmount]);

  const handlePress = (index) => {
    setSelectedIndex(index);
  };

  const CourierAPIKey = "20100d3a439b4d1399f527d08a303f7a";

  useEffect(() => {
    // Set up an observer for changes in the authentication state
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // If the user is authenticated, set up listeners for user data and cart data

        // Set up a query for the user's cart based on their UID
        const cartCollectionRef = firestore
          .collection("Cart")
          .where("uid", "==", user.uid);

        // Set up a snapshot listener for changes in the user's cart
        const unsubscribeCartSnapshot = cartCollectionRef.onSnapshot(
          (snapshot) => {
            // Update the cart count based on the number of items in the cart
            const itemCount = snapshot.docs.length;
            setCartCount(itemCount);
          }
        );

        // Set up a reference to the user document in the "Users" collection
        const userDocRef = firestore.collection("Users").doc(user.uid);

        // Set up a snapshot listener for changes in the user document
        const unsubscribeSnapshot = userDocRef.onSnapshot((doc) => {
          if (doc.exists) {
            // If the user document exists, set the user data state
            setUserData(doc.data());
            console.log("data from users: ", doc.data());
          } else {
            console.error("User data not found");
          }
        });

        // Cleanup functions to unsubscribe from the snapshot listeners when the component unmounts
        return () => {
          unsubscribeCartSnapshot();
          unsubscribeSnapshot();
        };
      } else {
        // If the user is not authenticated, reset user data and cart count
        setUserData(null);
        setCartCount(0);
      }
    });

    // Cleanup function to unsubscribe from the authentication state listener when the component unmounts
    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Function to navigate to the "Landing" screen
  const navigateToLanding = () => {
    navigation.navigate("Landing");
  };

  // Function to navigate to the "OrderHistory" screen
  const navigateToOrderHistory = () => {
    navigation.navigate("OrderHistory");
  };

  // useEffect hook to calculate various values based on changes in dependencies
  useEffect(() => {
    // Calculate the total amount of items in the cart
    const totalAmount = cartData.reduce((acc, item) => acc + item.amount, 0);

    // Calculate the referral amount as 10% of the total amount
    const calculatedReferral = totalAmount * 0.1;
    setAgentReferral(calculatedReferral);

    // Calculate the tax amount as 15% of the total amount
    const taxAmount = totalAmount * 0.15;
    setTax(taxAmount);

    // Calculate the delivery charge based on the selected index and rates
    const delivery =
      selectedIndex !== null ? rates[selectedIndex].base_rate.charge : 0;

    // Calculate the final total by adding up the total, referral, tax, and delivery
    const finalTotal = totalAmount + calculatedReferral + taxAmount + delivery;
    setOrderTotal(finalTotal);
  }, [cartData, selectedIndex, rates]);

  useEffect(() => {
    // Get the current date in ISO format
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    // Define common rates information
    const commonRates = {
      collection_address: {
        type: "business",
        company: "Atlegile@co.za",
        street_address: "Diepkloof 319-Iq",
        local_area: "Soweto",
        city: "City of Johannesburg Metropolitan Municipality",
        zone: "Gauteng",
        country: "ZA",
        code: "1862",
        lat: -26.2609931,
        lng: 27.9502322,
      },
      parcels: [
        {
          submitted_length_cm: totalLength,
          submitted_width_cm: totalWidth,
          submitted_height_cm: totalHeight,
          submitted_weight_kg: totalWeight,
        },
      ],
      declared_value: cartData.price,
      collection_min_date: formattedDate,
      delivery_min_date: formattedDate,
    };

    // Define delivery rates information based on fixedAddress and coordinates
    const deliveryRates = {
      delivery_address: {
        type: "",
        company: "",
        street_address: fixedAddress.streetAddress,
        local_area: fixedAddress.localArea,
        city: fixedAddress.localCity,
        zone: fixedAddress.zoneCity,
        country: fixedAddress.countryOfCity,
        code: fixedAddress.postalCode,
        lat: coordinates.lat,
        lng: coordinates.lng,
      },
    };

    // Combine commonRates and deliveryRates into a single object
    const theRates = { ...commonRates, ...deliveryRates };

    // Function to make an API call to get rates from the courier
    const gettingRate = async () => {
      console.log("theRatesCollectionAdress ", theRates.collection_address);
      console.log("theRatesDeliverAdress ", theRates.delivery_address);

      const config = {
        headers: {
          Authorization: `Bearer ${CourierAPIKey}`,
          "Content-Type": "application/json",
        },
      };

      try {
        // Make a POST request to the courier API to get rates
        const response = await axios.post(
          "https://api.shiplogic.com/v2/rates",
          theRates,
          config
        );

        console.log("Courier API rates response:", response.data);

        if (response.data.rates) {
          // Update the component state with the received rates
          setRates(response.data.rates);
        } else {
          console.log("Rates not found in the response");
        }
      } catch (error) {
        console.error("Error getting rates", error);

        if (error.response) {
          console.log("Response data:", error.response.data);
        }
      }
    };

    // Call the function to get rates when the component mounts or when fixedAddress or location changes
    gettingRate();
  }, [fixedAddress, location]);

  const creattingShipment = async () => {
    // Define common shipment information
    const commonShipment = {
      collection_address: {
        type: "business",
        company: "Atlegile@co.za",
        street_address: "Diepkloof 319-Iq",
        local_area: "Soweto",
        city: "City of Johannesburg Metropolitan Municipality",
        zone: "Gauteng",
        country: "ZA",
        code: "1862",
        lat: -26.2609931,
        lng: 27.9502322,
      },
      collection_contact: {
        name: theBusinessName,
        mobile_number: "",
        email: "cornel+sandy@uafrica.com",
      },
      delivery_contact: {
        name: "Boiketlo Mochochoko",
        mobile_number: "0734157351",
        email: "mochochokoboiketlo@gmail.com",
      },
      parcels: [
        {
          parcel_description: "Standard flyer",
          submitted_length_cm: totalLength,
          submitted_width_cm: totalWidth,
          submitted_height_cm: totalHeight,
          submitted_weight_kg: totalWeight,
        },
      ],
      opt_in_rates: [],
      opt_in_time_based_rates: [76],
      special_instructions_collection:
        "This is a test shipment - DO NOT COLLECT",
      special_instructions_delivery:
        rates[selectedIndex].service_level.description,
      declared_value: cartData.price,
      collection_min_date: rates[selectedIndex].service_level.collection_date,
      collection_after: "08:00",
      collection_before: "16:00",
      delivery_min_date: rates[selectedIndex].service_level.delivery_date_from,
      delivery_after: "10:00",
      delivery_before: "17:00",
      custom_tracking_reference: "",
      customer_reference: "ORDERNO123",
      service_level_code: rates[selectedIndex].service_level.code,
      mute_notifications: false,
    };

    // Define delivery address information based on fixedAddress and coordinates
    const deliveryAddress = {
      delivery_address: {
        type: "",
        company: "",
        street_address: fixedAddress.streetAddress,
        local_area: fixedAddress.localArea,
        city: fixedAddress.localCity,
        zone: fixedAddress.zoneCity,
        country: fixedAddress.countryOfCity,
        code: fixedAddress.postalCode,
        lat: coordinates.lat,
        lng: coordinates.lng,
      },
    };

    // Combine commonShipment and deliveryAddress into a single object
    const shipment = { ...commonShipment, ...deliveryAddress };

    // Set up the request headers for the courier API
    const config = {
      headers: {
        Authorization: `Bearer ${CourierAPIKey}`,
        "Content-Type": "application/json",
      },
    };

    try {
      // Make a POST request to create a shipment using the courier API
      const response = await axios.post(
        "https://api.shiplogic.com/v2/shipments",
        shipment,
        config
      );
      setTrackingRef(response.data.short_tracking_reference);
      setDriver(response.data.delivery_agent_id);

      // Return the response data
      return response.data;
    } catch (error) {
      // Handle errors during the API request
      console.error("Error creating shipment:", error);

      if (error.response) {
        console.log("Response status:", error.response.status);
        console.log("Response data:", error.response.data);
      } else if (error.request) {
        console.log("No response received. Request made but no response.");
      } else {
        console.log("Error in making the request:", error.message);
      }
    }
  };

  useEffect(() => {
    // Function to track a shipment using the courier API
    const tackingShipment = async () => {
      // Set up the request headers for the courier API
      const config = {
        headers: {
          Authorization: `Bearer ${CourierAPIKey}`,
          "Content-Type": "application/json",
        },
      };

      try {
        // Make a GET request to track the shipment using the tracking reference
        const response = await axios.get(
          `https://api.shiplogic.com/v2/tracking/shipments?tracking_reference=${trackingRef}`,
          config
        );

        // Log the response data and update component state with shipment status
        console.log(
          "Courier API tracking shipment response:",
          response.data.shipments[0].status
        );
        console.log(
          "shipmentStatus is ",
          response.data.shipments[0].tracking_events[0].status
        );
        setShipmentStatus(response.data.shipments[0].tracking_events[0].status);
      } catch (error) {
        // Handle errors during the API request
        console.error("Error getting shipments", error);

        if (error.response) {
          console.log("Response data:", error.response.data);
        }

        // Return an empty array in case of an error
        return [];
      }
    };

    // Call the function to track the shipment when the trackingRef changes
    tackingShipment();
  }, [trackingRef]);

  useEffect(() => {
    // Function to handle adding an item to the cart in the Firestore database
    const handleAddToCart = async () => {
      try {
        // Get a reference to the "Orders" collection in Firestore
        const cartCollectionRef = collection(firestore, "Orders");

        // Add a new document to the "Orders" collection with order details
        await addDoc(cartCollectionRef, {
          createdAt: serverTimestamp(),
          trackingEventsRef: trackingRef,
          deliveryAddress: location,
          deliveryDate: serverTimestamp(),
          deliveryFee: rates[selectedIndex].base_rate.charge,
          deliveryGuy: driver,
          name: userData?.name,
          userName: userData?.name,
          invoiceNumber: `#${Math.floor(
            Math.random() * 10000000
          )}555${Math.floor(Math.random() * 100000000)}`,
          DeliveryStatus: shipmentStatus,
          userId: userData?.uid,
          orderNumber: `#${
            userData?.uid?.slice(5, 15) + Math.floor(Math.random() * 10000)
          }`,
          totalAmount: orderTotal,
          items: [...newArr],
        });

        // Log success message and proceed to handle payment
        console.log("Item added to the cart!");
        handlePayment();
        // navigation.navigate("DateSelectionAndCheckout");
      } catch (error) {
        // Handle errors during the addition of the item to the cart
        console.error("Error adding item to cart:", error);
      }
    };

    // Call the function to add the item to the cart when the shipmentStatus changes
    handleAddToCart();
  }, [shipmentStatus]);

  const handlePayment = () => {
    // Construct the payment URL with the necessary parameters
    const paymentUrl = `https://sandbox.payfast.co.za/eng/process?merchant_id=10000100&merchant_key=46f0cd694581a&return_url=${url}/&cancel_url=${url}/&notify_url=${url}/&amount=${orderTotal}&item_name=CartItems`;
    orderTotal.toFixed(2) + // Use the calculated orderTotal here
      "&item_name=TestProduct";

    // Open the payment URcartDatanL in the device's default browser
    Linking.openURL(paymentUrl);
  };

  const handleSelect = async (value) => {
    try {
      // Use geocodeByAddress to get location details based on the selected address
      const results = await geocodeByAddress(value);

      // Use getLatLng to extract latitude and longitude from the geocoded results
      const latLng = await getLatLng(results[0]);

      // Reset any previous error state
      setError(null);

      // Set the address state with the selected place details
      setAddress(results[0]);

      // Set the coordinates state with the latitude and longitude
      setCoordinates(latLng);

      // Trigger some action related to address card visibility
      setAddressCard(true);
    } catch (error) {
      // Handle geocoding errors
      console.error("Geocoding error:", error);

      // Set an error message in the state
      setError("Geocoding error. Please try again.");
    }
  };

  useEffect(() => {
    // Set the location state with the formatted address
    setLocation(address.formatted_address);

    // Initialize variables for address components
    let streetAddress,
      localArea,
      localCity,
      zoneCity,
      countryOfCity,
      postalCode;

    // Check if address has address components
    if (address.address_components) {
      const { address_components } = address;
      const length = address_components.length;

      // Switch based on the length of address components
      switch (length) {
        // ... cases for different lengths
        case 1:
          postalCode = address_components[0].long_name;
          break;
        case 2:
          countryOfCity = address_components[0].short_name;
          postalCode = address_components[1].long_name;
          break;
        case 3:
          countryOfCity = address_components[1].short_name;
          postalCode = address_components[2].long_name;
          break;
        case 4:
          localCity = address_components[0].long_name;
          countryOfCity = address_components[2].short_name;
          postalCode = address_components[3].long_name;
          break;
        case 5:
          localArea = address_components[0].long_name;
          localCity = address_components[1].long_name;
          countryOfCity = address_components[3].short_name;
          postalCode = address_components[4].long_name;
          break;
        case 6:
          localArea = address_components[0].long_name;
          localCity = address_components[1].long_name;
          zoneCity = address_components[2].long_name;
          countryOfCity = address_components[3].short_name;
          postalCode = address_components[4].long_name;
          break;
        case 7:
          streetAddress = `${address_components[1].long_name} ${address_components[0].long_name}`;
          localArea = address_components[2].long_name;
          localCity = address_components[3].long_name;
          zoneCity = address_components[4].long_name;
          countryOfCity = address_components[5].short_name;
          postalCode = address_components[6].long_name;
          break;
        case 8:
          streetAddress = `${address_components[0].long_name} ${address_components[1].long_name}`;
          localArea = address_components[2].long_name;
          localCity = address_components[4].long_name;
          zoneCity = address_components[5].long_name;
          countryOfCity = address_components[6].short_name;
          postalCode = address_components[7].long_name;
          break;
        case 9:
          streetAddress = `${address_components[1].long_name} ${address_components[2].long_name}`;
          localArea = `${address_components[2].long_name} ${address_components[0].long_name}`;
          localCity = address_components[5].long_name;
          zoneCity = address_components[6].long_name;
          countryOfCity = address_components[7].short_name;
          postalCode = address_components[8].long_name;
          break;
        default:
          console.error("Invalid length of address components.");
          return;
      }
      // Set the fixedAddress state with extracted address components
      setFixedAddress({
        streetAddress,
        localArea,
        localCity,
        zoneCity,
        countryOfCity,
        postalCode,
      });
    }
  }, [address, isPicked]);

  const handleFixAddress = () => {
    // Update the fixedAddress state based on edited values or maintain existing values
    setFixedAddress((prevAddress) => ({
      ...prevAddress,
      streetAddress: editedValue.streetAddress || prevAddress.streetAddress,
      localArea: editedValue.localArea || prevAddress.localArea,
      localCity: editedValue.localCity || prevAddress.localCity,
      zoneCity: editedValue.zoneCity || prevAddress.zoneCity,
      countryOfCity: editedValue.countryOfCity || prevAddress.countryOfCity,
      postalCode: editedValue.postalCode || prevAddress.postalCode,
      // Update other fields similarly based on your requirements
    }));

    // Close the addressCard modal or handle other logic
    setAddressCard(false);
  };

  // Function to render an address field component
  const renderAddressField = (label, value, field) => (
    // Grid container for layout
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
      style={{ padding: 10 }}
    >
      {/* Grid item for displaying label */}
      <Grid item xs={6}>
        <Typography>{label}:</Typography>
      </Grid>

      {/* Grid item for an editable text field */}
      <Grid item xs={6}>
        <TextField
          fullWidth
          variant="outlined"
          value={value}
          // Handle onChange event to update editedValue state
          onChange={(e) =>
            setEditedValue((prev) => ({ ...prev, [field]: e.target.value }))
          }
        />
      </Grid>
    </Grid>
  );

  return (
    <>
      {addressCard ? (
        // If addressCard is true, display the following component
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="absolute"
          width="100%"
          height="100%"
          flex={1}
          backgroundColor="rgba(0, 0, 0, 0.5)"
          zIndex={9999}
        >
          {/* Container for the address card */}
          <Box
            height="auto"
            width="90vw"
            maxWidth={400}
            backgroundColor="white"
            justifyContent="center"
            p={2} // Padding added for all sides
          >
            {/* View for aligning content in the center */}
            <View style={{ justifyContent: "center" }}>
              {/* Address field components */}
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  padding: 10,
                }}
              >
                {editStreetAdress ? (
                  // If editing street address, render address field component
                  renderAddressField(
                    "street_address",
                    editedValue.streetAddress,
                    "streetAddress"
                  )
                ) : (
                  // Display street address and option to edit
                  <>
                    <Text>street_address:</Text>
                    <Text>{fixedAddress.streetAddress}</Text>
                    <TouchableOpacity onPress={() => setEditStreetAdress(true)}>
                      <Text>Edit</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
              {/* Repeat similar blocks for other address fields */}
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  padding: 10,
                }}
              >
                {editLocalArea ? (
                  renderAddressField(
                    "local area",
                    editedValue.localArea,
                    "localArea"
                  )
                ) : (
                  <>
                    <Text style={{ alignSelf: "flex-start" }}>local area:</Text>
                    <Text>{fixedAddress.localArea}</Text>
                    <TouchableOpacity onPress={() => setEditLocalArea(true)}>
                      <Text>Edit</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  padding: 10,
                }}
              >
                {" "}
                {editCity ? (
                  renderAddressField("city", editedValue.localCity, "localCity")
                ) : (
                  <>
                    <Text style={{ alignSelf: "flex-start" }}>city:</Text>
                    <Text>{fixedAddress.localCity}</Text>
                    <TouchableOpacity onPress={() => setEditCity(true)}>
                      <Text>Edit</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  padding: 10,
                }}
              >
                {editCounty ? (
                  renderAddressField(
                    "country",
                    editedValue.countryOfCity,
                    "countryOfCity"
                  )
                ) : (
                  <>
                    <Text style={{ alignSelf: "flex-start" }}>country:</Text>
                    <Text>{fixedAddress.countryOfCity}</Text>
                    <TouchableOpacity onPress={() => setEditCountry(true)}>
                      <Text>Edit</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  padding: 10,
                }}
              >
                {" "}
                {editZone ? (
                  renderAddressField(
                    "Province(zone)",
                    editedValue.zoneCity,
                    "zoneCity"
                  )
                ) : (
                  <>
                    <Text style={{ alignSelf: "flex-start" }}>
                      Province(zone):
                    </Text>
                    <Text>{fixedAddress.zoneCity}</Text>
                    <TouchableOpacity onPress={() => setEditZone(true)}>
                      <Text>Edit</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  padding: 10,
                }}
              >
                {" "}
                {editCode ? (
                  renderAddressField(
                    "code",
                    editedValue.postalCode,
                    "postalCode"
                  )
                ) : (
                  <>
                    <Text style={{ alignSelf: "flex-start" }}>code:</Text>
                    <Text>{fixedAddress.postalCode}</Text>
                    <TouchableOpacity onPress={() => setEditCode(true)}>
                      <Text>Edit</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
              <Button
                variant="outlined"
                sx={{
                  width: "80%",
                  alignSelf: "center",
                  borderColor: "lightgrey",
                  borderRadius: 15,
                }}
                onClick={() => handleFixAddress()}
              >
                <Typography sx={{ fontSize: 16, color: "#062338" }}>
                  SUBMIT
                </Typography>
              </Button>
            </View>
          </Box>
        </Box>
      ) : null}
      <FollowUs />
      {/* <Navbar /> */}
      <ScrollView style={{ flexDirection: "column", backgroundColor: "white" }}>
        <Container sx={{ minHeight: "90vh" }}>
          <Grid container spacing={2} mx="auto">
            <Grid item xs={12} md={8}>
              {/* Left Side Content */}
              <Box mt={2} pr={4}>
                {/* Heading displaying the order number */}
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  ORDER #ABC246
                </Typography>

                {/* Container for navigation links */}
                <View style={{ display: "flex", flexDirection: "row" }}>
                  {/* Account link */}
                  <Typography>
                    <TouchableOpacity
                      onPress={navigateToLanding}
                      style={{ color: "grey" }}
                    >
                      <Text>Acount /</Text>
                    </TouchableOpacity>
                  </Typography>

                  {/* Cart link */}
                  <Typography>
                    <TouchableOpacity
                      onPress={navigateToOrderHistory}
                      style={{ color: "grey" }}
                    >
                      Cart
                    </TouchableOpacity>
                  </Typography>
                </View>

                {/* Heading for the cart section */}
                <Typography
                  variant="h4"
                  style={{ marginTop: "50px", fontWeight: "bold" }}
                >
                  CART
                </Typography>
                {/* ScrollView container with specific styles */}
                <ScrollView
                  style={{ flex: 1, height: "50vh", alignSelf: "center" }}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Grid container for displaying items in the cart */}

                  <Grid container spacing={2}>
                    {cartData.map((item, index) => (
                      // Grid item for each item in the cart
                      <Grid item xs={12} key={index}>
                        {/* Card component representing each item */}
                        <Card
                          sx={{ height: "auto", borderBottomColor: "black" }}
                        >
                          {/* Box component for organizing content */}
                          <Box
                            display="flex"
                            flexDirection={{ xs: "column", md: "row" }}
                            alignItems="center"
                            borderBottomWidth={2}
                            padding={2}
                          >
                            {/* Box for displaying product image */}
                            <Box
                              width={{ xs: "100%", md: "30%" }}
                              marginBottom={{ xs: 2, md: 0 }}
                            >
                              {/* ImageList for rendering product image */}
                              <ImageList cols={1} rowHeight="100%">
                                <ImageListItem style={{ width: "100%" }}>
                                  {/* Product image */}
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                </ImageListItem>
                              </ImageList>
                            </Box>
                            {/* Box for displaying product name */}
                            <Box
                              width={{ xs: "100%", md: "30%" }}
                              paddingLeft={{ xs: 0, md: 2 }}
                              marginBottom={{ xs: 2, md: 0 }}
                            >
                              {/* Typography for the "Product" label */}
                              <Typography
                                fontSize={16}
                                fontWeight="bold"
                                color="gray"
                              >
                                Product
                              </Typography>
                              {/* Typography for displaying the product name */}
                              <Typography fontSize={18} fontWeight="bold">
                                {item.name}
                              </Typography>
                            </Box>
                            {/* Box for displaying quantity */}
                            <Box
                              width={{ xs: "100%", md: "30%" }}
                              paddingLeft={{ xs: 0, md: 2 }}
                              marginBottom={{ xs: 2, md: 0 }}
                            >
                              {/* Typography for the "Quantity" label */}
                              <Typography
                                fontSize={16}
                                fontWeight="bold"
                                color="gray"
                              >
                                Quantity
                              </Typography>
                              {/* Typography for displaying the quantity */}
                              <Typography fontSize={18} fontWeight="bold">
                                {item.quantity}
                              </Typography>
                            </Box>
                            {/* Box for displaying amount */}
                            <Box
                              width={{ xs: "100%", md: "30%" }}
                              paddingLeft={{ xs: 0, md: 2 }}
                            >
                              {/* Typography for the "Amount" label */}
                              <Typography
                                fontSize={16}
                                fontWeight="bold"
                                color="gray"
                              >
                                Amount
                              </Typography>
                              {/* Typography for displaying the amount */}
                              <Typography fontSize={18} fontWeight="bold">
                                {item.amount}
                              </Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </ScrollView>

                {cartData.length > 1 || cartData.length === 1 ? (
                  <>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography style={{ fontWeight: "bold" }}>
                        Order Summary
                      </Typography>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        marginTop: "8px",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography style={{ fontWeight: "bold" }}>
                        Delivery
                      </Typography>
                      {selectedIndex !== null && (
                        <Typography style={{ fontWeight: "bold" }}>
                          R{rates[selectedIndex].base_rate.charge}
                        </Typography>
                      )}
                    </View>

                    <View
                      style={{
                        display: "flex",
                        marginTop: "8px",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography style={{ fontWeight: "bold" }}>
                        {" "}
                        Agent Referral
                      </Typography>
                      <Typography style={{ fontWeight: "bold" }}>
                        {selectedIndex !== null
                          ? `R${agentReferral.toFixed(2)}`
                          : null}
                      </Typography>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        marginTop: "8px",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography style={{ fontWeight: "bold" }}>
                        {" "}
                        Tax{" "}
                      </Typography>
                      <Typography style={{ fontWeight: "bold" }}>
                        {selectedIndex !== null ? `R${tax.toFixed(2)}` : null}
                      </Typography>
                    </View>

                    <View
                      style={{
                        display: "flex",
                        marginTop: "8px",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="h5" style={{ fontWeight: "bold" }}>
                        Total
                      </Typography>
                      <Typography variant="h5" style={{ fontWeight: "bold" }}>
                        R {orderTotal}
                      </Typography>
                    </View>
                  </>
                ) : null}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              {/* Right Side Content */}
              <Box
                backgroundColor="#062338"
                mt={2}
                p={2}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                mpr={4}
              >
                <Box mb={4}>
                  <View>
                    <Typography
                      variant="h5"
                      style={{
                        color: "#FFFFFF",
                        marginBottom: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      DELIVERY DETAILS
                    </Typography>
                    {addressInput ? (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "flex-star",
                          width: "100%",
                          height: "80vh",
                          backgroundColor: "white",
                        }}
                      >
                        <PlacesAutocomplete
                          value={address}
                          onChange={setAddress}
                          onSelect={handleSelect}
                        >
                          {({
                            getInputProps,
                            suggestions,
                            getSuggestionItemProps,
                            loading,
                          }) => (
                            <View>
                              <TextField
                                fullWidth
                                id="places-autocomplete-input"
                                placeholder="Type location"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                {...getInputProps()}
                              />
                              <View>
                                {loading && <Typography>Loading...</Typography>}
                                {suggestions.map((suggestion) => (
                                  <View
                                    style={{ width: "20vw" }}
                                    {...getSuggestionItemProps(suggestion)}
                                    key={suggestion.placeId}
                                  >
                                    <Typography
                                      style={{
                                        width: "70%",
                                        display: "flex",
                                        flexWrap: "wrap",
                                        color: "gray",
                                      }}
                                    >
                                      {suggestion.description}
                                    </Typography>
                                  </View>
                                ))}
                              </View>
                              {error && (
                                <Text style={{ color: "red" }}>{error}</Text>
                              )}
                            </View>
                          )}
                        </PlacesAutocomplete>

                        <TouchableOpacity
                          style={{
                            color: "black",
                            border: "2px #062338 solid",
                            padding: 10,
                            borderRadius: 30,
                            //marginLeft:10
                            height: "6.5vh",
                            //backgroundColor: "#062338",
                          }}
                          onPress={() => setAddessInput(false)} // Assuming setAddessInput is a function
                        >
                          <Text
                            style={{ color: "#062338", paddingHorizontal: 8 }}
                          >
                            Close
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography style={{ color: "#B7B9BC" }}>
                            Delivery Address
                          </Typography>
                          <TouchableOpacity
                            style={{
                              color: "#B7B9BC",
                              border: "2px white solid",
                              padding: 10,
                              borderRadius: 30,
                            }}
                            onPress={() => setAddessInput(true)} // Assuming setAddessInput is a function
                          >
                            <Text
                              style={{ color: "white", paddingHorizontal: 10 }}
                            >
                              Type
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            borderBottom: "1px white solid",
                            marginBottom: 15,
                          }}
                        >
                          <Typography variant="h6" style={{ color: "#FFFFFF" }}>
                            {location && location.slice(0, 30)}
                            {location && location.length < 50 ? "" : "..."}
                          </Typography>
                        </View>
                        <MapContainer
                          center={[coordinates.lat, coordinates.lng]}
                          zoom={13}
                          ref={mapRef}
                          style={{
                            height: "20vh",
                            width: "100%",
                            borderRadius: "25px",
                          }}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[coordinates.lat, coordinates.lng]}>
                            <Popup>
                              <FontAwesomeIcon
                                icon={faMapMarkerAlt}
                                size="lg"
                                color="black"
                              />
                            </Popup>
                          </Marker>
                          {/* Additional map layers or components can be added here */}
                        </MapContainer>
                        <Typography
                          style={{ color: "grey", marginTop: "14px" }}
                        >
                          Delivery Notes
                        </Typography>
                        <Typography style={{ color: "white" }}>
                          In essence, AMS aims to not only help businesses grow
                          but also make a positive image on society by nurturing
                          local talent and fostering sustainable busibess
                          growth.
                        </Typography>
                      </>
                    )}

                    {cartData.length > 1 || cartData.length === 1 ? (
                      <View>
                        <Typography
                          style={{ color: "#FFFFFF", marginTop: "14px" }}
                        >
                          Select Delivery date
                        </Typography>
                        {location ? (
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              flexWrap: "wrap", // Added flexWrap to allow wrapping
                              width: "100%",
                            }}
                          >
                            {rates.map((rate, index) => (
                              <View key={index}>
                                <TouchableOpacity
                                  onPress={() => handlePress(index)}
                                  style={{
                                    height: "100px",
                                    width: "80px",
                                    marginTop: "10px",
                                    borderWidth: 1,
                                    borderColor: "white",
                                    marginRight: 10,
                                    backgroundColor:
                                      selectedIndex === index
                                        ? "#2E5A88"
                                        : "transparent",
                                  }}
                                >
                                  <View
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginTop: "20px",
                                    }}
                                  >
                                    <Typography style={{ color: "white" }}>
                                      {new Date(
                                        rate.service_level.delivery_date_to
                                      ).toLocaleString("default", {
                                        month: "short",
                                      })}
                                    </Typography>
                                    <Typography
                                      variant="h5"
                                      style={{ color: "white" }}
                                    >
                                      {new Date(
                                        rate.service_level.delivery_date_to
                                      ).getDate()}
                                    </Typography>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            ))}
                          </View>
                        ) : null}
                      </View>
                    ) : null}
                  </View>
                </Box>
                <Button
                  variant="outlined"
                  sx={{
                    width: "80%",
                    alignSelf: "center",
                    borderColor: "lightgrey",
                    borderRadius: 15,
                  }}
                  onClick={creattingShipment}
                >
                  <Typography sx={{ fontSize: 16, color: "#FFFFFF" }}>
                    CHECKOUT
                  </Typography>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <Footer />
        {/* <View style={{backgroundColor: 'blue', width: '100%', height: 200 }}></View> */}
      </ScrollView>
    </>
  );
};

export default DateSelectionAndCheckout;
