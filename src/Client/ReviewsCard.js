import React, { useState, useEffect } from "react";
import { Box, Typography, Rating } from "@mui/material";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebase, auth } from "../config";

import firebaseConfig from "../config";

const ReviewsCard = ({ review }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const app = firebase.initializeApp(firebaseConfig);
      const firestore = getFirestore(app);

      try {
        const userDocRef = doc(firestore, "Users", review.userID);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserData(userData);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [review.userID]);

  return (
    <Box sx={{ pl: 3, mb: 6 }}>
      <Rating
        name="half-rating-read"
        defaultValue={review.myRatings}
        precision={0.5}
        readOnly
      />
      <Box>
        <Typography>{review.review}</Typography>
      </Box>
      {userData && (
        <>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 22 }}>
              {userData.firstName} {userData.lastName}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: "#5abcf4", fontSize: 15 }}>
              {userData.role}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ReviewsCard;
