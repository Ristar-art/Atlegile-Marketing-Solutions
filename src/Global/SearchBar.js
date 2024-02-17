import { Box, TextField, IconButton } from "@mui/material";
import { View, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { useState } from "react";

export default function SearchBar() {
  const [search, setSearch] = useState("");

  const handleFilterIconClick = () => {
    console.log("Filter Button Clicked!!!");
  };

  const handleSearchIconClick = () => {
    console.log("Search Button Clicked!!!");
  };

  return (
    <Box
      className="search-bar-container"
      size="100%"
      sx={{
        width: " 100%",
        height: "13rem",
        backgroundColor: "#070f18",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/image/left_lion.png")}
        alt="Shop 1"
        width={250}
        height={205}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 300,
          height: 200,
        }}
      />
      <Box
        className="search-bar-body"
        // padding={0}
        sx={{
          // backgroundColor: "red",
          width: "40vw",
          height: "13rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/image/logo2.png")}
          alt="AMS COMPANY"
          style={{
            // marginTop: "1px",
            marginTop: 20,
            height: "50px",
            color: "white",
            marginBottom: "50px",
            width: 150,
            height: 50,
            zIndex:9000
          }}
        />
        <Box
          style={{
            padding: "10px",
            width: "100%",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "row",
            height: "40px",
            zIndex:9000
          }}
        >
          <TextField
            fullWidth
            id="search"
            label="search..."
            variant="standard"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{}}
          />
          <Box
            className="icons-container"
            sx={{ display: "flex", justifyContent: "space-around" }}
          >
            <IconButton onClick={handleFilterIconClick}>
              <Image
                source={require("../../assets/icons/filter.svg")}
                alt="Image filter"
                style={{ width: 25, height: 25 }}
              />
            </IconButton>
            <IconButton onClick={handleSearchIconClick}>
              <Image
                source={require("../../assets/icons/search-status.svg")}
                alt="Image search"
                style={{ width: 25, height: 25 }}
              />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Image
        source={require("../../assets/image/right_lion.png")}
        alt="Shop 2"
        width={250}
        height={205}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 300,
          height: 200,
        }}
      />
    </Box>
  );
}
