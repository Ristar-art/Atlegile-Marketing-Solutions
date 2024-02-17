import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Icon from "react-native-vector-icons/FontAwesome5";
import Icon2 from "react-native-vector-icons/Feather";
import Icon3 from "react-native-vector-icons/EvilIcons";
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';

const FollowUs = () => {
  const navigation = useNavigation();
  const [width, setWidth] = useState(Dimensions.get('window').width);
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
        backgroundColor: "#252b42",
        color: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px",
        paddingHorizontal: 20,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Icon2 name="phone" size={16} color="white" />
        <Typography variant="subtitle2">(225) 555-0118</Typography>
      </Box>

      {isLargeDevice && (
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <Icon3 name="envelope" size={20} color="white" />
          <Typography variant="subtitle2">michelle.rivera@example.com</Typography>
        </Box>
      )}

      {isLargeDevice && (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
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
        }}
      >
        <Typography>Follow Us : </Typography>
        <Icon
          name="instagram"
          size={16}
          color="white"
          style={{ paddingHorizontal: 10 }}
        />
        <Icon onPress={openYouTube}
          name="youtube"
          size={16}
          color="white"
          style={{ paddingHorizontal: 10 }}
        />
        {isLargeDevice && (
          <>
            <Icon
              name="facebook"
              size={16}
              color="white"
              style={{ paddingHorizontal: 10 }}
            />
            <Icon
              name="twitter"
              size={16}
              color="white"
              style={{ paddingHorizontal: 10 }}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default FollowUs;
