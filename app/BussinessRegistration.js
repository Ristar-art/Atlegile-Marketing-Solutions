import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
// import { TextInput, Picker } from "react-native";
// import { WebView } from "react-native-webview";
import { router, useNavigation, useRouter } from "expo-router";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
// import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// import background from "../../Global/images/Reed.jpg";
// import logo from "../../Global/images/logo.svg";
// import Banner from "../../Global/images/media bg-cover.png";
import { auth, firestore, firebase } from "../src/config";
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";
import { Typography } from "@mui/material";
// import ReactDOM from "react-dom";
// import App from "../../../App";
// import PlacesAutocomplete, {
//     geocodeByAddress,
//     getLatLng,
//   } from "react-places-autocomplete";
//import { Head } from 'react-native-web';

const AppDiscreiption = "Atlegile Markwting Solutions"; // Add your actual description here

const BusinessRegistration = () => {
  const navigation = useNavigation();
  const [businessName, setBusinessName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [cardHolder, setCardHolder] = useState(null);
  const [cardNumber, setCardNumber] = useState(null);
  const [cvv, setCvv] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [address, setAddress] = useState({});
  const [coordinates, setCoordinates] = useState({});
  const [locationDetails, setLocationDetails] = useState({});
 const router = useRouter()
  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, get the UID
        setCurrentUserUID(user.uid);
      } else {
        // User is signed out
        setCurrentUserUID(null);
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateaddproduct = () => {
    router.replace("/AddProducts");
  };

  const handlechange = async (event) => {
    event.preventDefault();

    // let streetAddress;

    // if (
    //   address.address_components.length === 5 ||
    //   address.address_components.length === 4 ||
    //   address.address_components.length === 3 ||
    //   address.address_components.length === 2 ||
    //   address.address_components.length === 1
    // ) {
    //   streetAddress = " ";
    // } else if (address.address_components.length === 6) {
    //   streetAddress = address.address_components[0].long_name;
    // } else if (address.address_components.length === 7) {
    //   streetAddress = address.address_components[0].long_name;
    // } else if (address.address_components.length === 8) {
    //   streetAddress = `${address.address_components[0].long_name} ${address.address_components[1].long_name}`;
    // } else if (address.address_components.length === 9) {
    //   streetAddress = ` ${address.address_components[1].long_name} ${address.address_components[2].long_name} `;
    // }

    // let localArea;

    // if (
    //   address.address_components.length === 4 ||
    //   address.address_components.length === 3 ||
    //   address.address_components.length === 2 ||
    //   address.address_components.length === 1
    // ) {
    //   localArea = " ";
    // } else if (address.address_components.length === 5) {
    //   localArea = address.address_components[0].long_name;
    // } else if (address.address_components.length === 6) {
    //   localArea = address.address_components[1].long_name;
    // } else if (address.address_components.length === 7) {
    //   localArea = address.address_components[1].long_name;
    // } else if (address.address_components.length === 8) {
    //   localArea = address.address_components[2].long_name;
    // } else if (address.address_components.length === 9) {
    //   localArea = `${address.address_components[3].long_name} ${address.address_components[0].long_name}`;
    // }

    // let localCity;

    // if (
    //   address.address_components.length === 3 ||
    //   address.address_components.length === 2 ||
    //   address.address_components.length === 1
    // ) {
    //   localCity = "";
    // } else if (address.address_components.length === 4) {
    //   localCity = address.address_components[0].long_name;
    // } else if (address.address_components.length === 5) {
    //   localCity = address.address_components[1].long_name;
    // } else if (address.address_components.length === 6) {
    //   localCity = address.address_components[2].long_name;
    // } else if (address.address_components.length === 7) {
    //   localCity = address.address_components[3].long_name;
    // } else if (address.address_components.length === 8) {
    //   localCity = address.address_components[4].long_name;
    // } else if (address.address_components.length === 9) {
    //   localCity = address.address_components[5].long_name;
    // }

    // let zoneCity;

    // if (
    //   address.address_components.length === 2 ||
    //   address.address_components.length === 1
    // ) {
    //   zoneCity = " ";
    // } else if (address.address_components.length === 3) {
    //   zoneCity = address.address_components[0].long_name;
    // } else if (address.address_components.length === 4) {
    //   zoneCity = address.address_components[1].long_name;
    // } else if (address.address_components.length === 5) {
    //   zoneCity = address.address_components[2].long_name;
    // } else if (address.address_components.length === 6) {
    //   zoneCity = address.address_components[3].long_name;
    // } else if (address.address_components.length === 7) {
    //   zoneCity = address.address_components[4].long_name;
    // } else if (address.address_components.length === 8) {
    //   zoneCity = address.address_components[5].long_name;
    // } else if (address.address_components.length === 9) {
    //   zoneCity = address.address_components[6].long_name;
    // }

    // let countryOfCity;

    // if (address.address_components.length === 1) {
    //   countryOfCity = " ";
    // } else if (address.address_components.length === 2) {
    //   countryOfCity = address.address_components[0].short_name;
    // } else if (address.address_components.length === 3) {
    //   countryOfCity = address.address_components[1].short_name;
    // } else if (address.address_components.length === 4) {
    //   countryOfCity = address.address_components[2].short_name;
    // } else if (address.address_components.length === 5) {
    //   countryOfCity = address.address_components[3].short_name;
    // } else if (address.address_components.length === 6) {
    //   countryOfCity = address.address_components[4].short_name;
    // } else if (address.address_components.length === 7) {
    //   countryOfCity = address.address_components[5].short_name;
    // } else if (address.address_components.length === 8) {
    //   countryOfCity = address.address_components[6].short_name;
    // } else if (address.address_components.length === 9) {
    //   countryOfCity = address.address_components[7].short_name;
    // }

    // let postalCode;

    // if (address.address_components.length === 1) {
    //   postalCode = address.address_components[0].long_name;
    // } else if (address.address_components.length === 2) {
    //   postalCode = address.address_components[1].long_name;
    // } else if (address.address_components.length === 3) {
    //   postalCode = address.address_components[2].long_name;
    // } else if (address.address_components.length === 4) {
    //   postalCode = address.address_components[3].long_name;
    // } else if (address.address_components.length === 5) {
    //   postalCode = address.address_components[4].long_name;
    // } else if (address.address_components.length === 6) {
    //   postalCode = address.address_components[5].long_name;
    // } else if (address.address_components.length === 7) {
    //   postalCode = address.address_components[6].long_name;
    // } else if (address.address_components.length === 8) {
    //   postalCode = address.address_components[7].long_name;
    // } else if (address.address_components.length === 9) {
    //   postalCode = address.address_components[8].long_name;
    // }

    try {
      setLoading(true);

      await firestore.collection("Business").add({
        businessName,
        selectedRole,
        regNumber,
        website,
        // location,
        selectedBusinessType,
        selectedIndustry,
        phoneNumber,
        bio,
        cardHolder,
        cardNumber,
        cvv,
        // locationDetails: {
        //   type: "business",
        //   company: website,
        //   street_address: streetAddress,
        //   local_area: localArea,
        //   city: localCity,
        //   zone: zoneCity,
        //   country: countryOfCity,
        //   code: postalCode,
        //   lat: coordinates.lat,
        //   lng: coordinates.lng,
        // },
        // userID: currentUserUID,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setShowSuccessAlert(true);

      setTimeout(() => {
        setLoading(false);
        router.replace("/AddProducts");
      }, 2000);
    } catch (error) {
      console.error("Error storing data in Firestore:", error);
      setLoading(false);
    }
  };
  const emptyOption = [""];

  const roleOptions = [
    ...emptyOption,
    "Graphic Designer",
    "Data Entry Specialist",
    "Project Manager",
    "Software Engineer",
    "Marketing Specialist",
    "Sales Manager",
    "Accountant",
    "HR Manager",
    "Content Writer",
    "Customer Support Specialist",
    "Product Manager",
    "Financial Analyst",
    "UI/UX Designer",
    "Network Administrator",
    "Legal Counsel",
    "Business Analyst",
    "Quality Assurance Engineer",
    "Data Scientist",
    "Operations Manager",
    "Research Scientist",
  ];

  const businessTypeOptions = [
    ...emptyOption,
    "Sole Proprietorship",
    "Partnership",
    "Online Business",
    "Limited Liability Company (LLC)",
    "Corporation",
    "Cooperative",
    "Franchise",
    "Nonprofit Organization",
    "Joint Venture",
    "S Corporation",
    "Trust",
    "Limited Partnership (LP)",
    "General Partnership",
    "Limited Liability Partnership (LLP)",
    "B Corporation",
    "Sole Proprietorship",
    "Freelancer or Independent Contractor",
    "Home-Based Business",
    "Retail Business",
    "E-commerce Business",
  ];

  const industryOptions = [
    ...emptyOption,
    "Technology",
    "Energy",
    "Telecommunications",
    "Healthcare",
    "Finance",
    "Education",
    "Entertainment",
    "Manufacturing",
    "Retail",
    "Transportation",
    "Agriculture",
    "Real Estate",
    "Hospitality",
    "Construction",
    "Automotive",
    "Media",
    "Aerospace",
    "Biotechnology",
    "Pharmaceutical",
    "Fashion",
  ];

  useEffect(() => {
    setLocation(address.formatted_address);
  }, [address]);

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
  return (
    <>
      <View
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
        }}
      >
        <Image
          source={require("../src/Global/images/Reed.jpg")}
          style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
        />
        <View
          style={{
            backgroundColor: "white",
            width: "37vw",
            position: "absolute",
            right: 16,
            top: 16,
            bottom: 16,
          }}
        >
          <View
            style={{
              // backgroundColor: "red",
              height: "95vh",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                height: "12vh",
                width: "15vw",
              }}
            >
              <Image
                source={require("../src/Global/images/logo.svg")}
                style={{ height: "12vh", width: "15vw" }}
              />
            </View>
            <div
              style={{
                // backgroundColor: "yellow",
                width: "80%",
                display: "flex",
                justifyContent: "left",
              }}
            >
              <form onSubmit={handlechange} style={{ width: "100%" }}>
                <View
                  // className="form-container"
                  style={{
                    justifyContent: "center",

                    // alignSelf: "center",

                    display: "flex",
                    // backgroundColor: "purple",
                    // alignSelf: "center",

                    // marginBottom: "30px",
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    BUSINESS REGISTRATION
                  </Typography>

                  <TextField
                    id="outlined-number"
                    label="Business Name"
                    type="text"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // style={{ width: "100%" ,height:"5vh"}}
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                  <br />
                  <TextField
                    id="outlined"
                    select
                    label="Role"
                    variant="standard"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    // style={{
                    //   width: "100%",
                    //   textAlign: "left",
                    //  // marginTop: "10px",
                    // }}
                  >
                    {roleOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <br />

                  <TextField
                    id="outlined-number"
                    label="Reg Number"
                    type="text"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // style={{
                    //   width: "100%",
                    //  // marginTop: "10px",
                    // }}
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    required
                  />
                  <br />

                  <TextField
                    id="outlined-number"
                    label="Website"
                    type="text"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // style={{ width: "100%",
                    //  //marginTop: "10px"
                    //  }}
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                   {/* <PlacesAutocomplete
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
                        </PlacesAutocomplete> */}

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                    }}
                  >
                    <TextField
                      id="outlined-select-currency"
                      select
                      label="Type of business"
                      variant="standard"
                      value={selectedBusinessType}
                      onChange={(e) => setSelectedBusinessType(e.target.value)}
                      style={{
                        width: "48%",
                        //marginTop: "5px",
                        marginRight: "10px",
                        textAlign: "left",
                      }}
                      required
                    >
                      {businessTypeOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      id="outlined-select-currency"
                      select
                      label="Industry"
                      variant="standard"
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      style={{
                        width: "48%",
                        // marginTop: "5px",
                        textAlign: "left",
                      }}
                      required
                    >
                      {industryOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </View>
                  <TextField
                    id="outlined-number"
                    label="Phone Number"
                    type="number"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{
                      width: "100%",
                      //  marginTop: "10px"
                    }}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <TextField
                    id="outlined-number"
                    label="Bio"
                    type="text"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{
                      width: "100%",
                      // marginTop: "10px"
                    }}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                  />
                  <Button
                     onClick={handlechange}
                    variant="contained"
                    style={{
                      width: "100%",
                      height: "10%",
                      marginTop: "3vh",
                      background: "#072840",
                      borderRadius: "30px",
                    }}
                    type="submit"
                  >
                    {loading ? (
                      <Box sx={{ display: "flex" }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </View>
              </form>
              {/* Display the success alert when showSuccessAlert is true */}
            </div>
          </View>
        </View>
      </View>

      <head>
        <meta
          name="description"
          content={`Business registration for ${AppDiscreiption}`}
        />
        <title>Your App Title</title>
      </head>
    </>
  );
};

export default BusinessRegistration;
