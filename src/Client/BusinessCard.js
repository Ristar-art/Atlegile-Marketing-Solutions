import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Button } from "react-native";
import { firebase, firestore, auth } from "../config"; // Adjust the path based on your project structure
import ProductCard from "../Global/Card";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
export default function BusinessCard({ business }) {
  console.log(business);
  const scrollViewRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchProducts = async () => {
      const productsRef = firebase.firestore().collection("Products");
      try {
        const snapshot = await productsRef.get();
        const productsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  let oneCompany = products.filter((item) => item.company === business);

  const scrollLeft = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, animated: true });
    }
  };

  const scrollRight = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleContentSizeChange = (contentWidth) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const bannerCollection = firestore.collection("Banner");
        const snapshot = await bannerCollection.get();

        const bannerData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            bannerImage: data.bannerImage,
            discountPrice: data.discountPrice,
            originalPrice: data.originalPrice,
            other: data.other,
            productName: data.productName,
            quantity: data.quantity,
          };
        });
        console.log("bannerData is ", bannerData);
        setBanner(bannerData);
      } catch (error) {
        console.error("Error fetching banner images:", error);
      }
    };

    fetchBanner();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (banner[0].bannerImage.length > 0) {
        setCurrentIndex((prevIndex) =>
          prevIndex === banner[0].bannerImage.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [banner]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banner[0].bannerImage.length - 1 : prevIndex - 1
    );
  };
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === banner[0].bannerImage.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      {business && (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 50,
            alignItems: "center",
            marginBottom: 50,
          }}
        >
          <View
            style={{
              width: "80%",
              height: "100vh",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              //backgroundColor:'red'
            }}
          >
            <TouchableOpacity onPress={scrollLeft}>
              <AntDesign name="leftcircle" size={40} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={scrollRight}>
              <AntDesign name="rightcircle" size={40} color="black" />
            </TouchableOpacity>

            <View
              style={{
                zIndex: -10,
                width: "100%",
                position: "absolute",
                //marginVertical: 16,
                //  backgroundColor:'red'
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  //marginTop: 20,
                  //  backgroundColor:'blue'
                }}
              >
                <Text
                  style={{
                    fontSize: "30px",
                    fontWeight: "bolder",
                    marginTop: "10px",
                  }}
                >
                  {business}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Products", { businessId: business })
                  }
                >
                  <Text>View All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                onContentSizeChange={(contentWidth) =>
                  handleContentSizeChange(contentWidth)
                }
              >
                {oneCompany.map((product) => (
                  <ProductCard key={product.id} productId={product.id} />
                ))}
              </ScrollView>
            </View>
          </View>
          {banner.length > 0 ? (
            <View
              style={{
                backgroundImage: `url(${banner[0].bannerImage[currentIndex]})`,
                backgroundColor: "gray",
                backgroundSize: "cover",
                backgroundPosition: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 55,
                flex: 1,
                transition: "0.5s ease-in-out",
                height: "20vh",
                width: "80%",
              }}
            >
              <TouchableOpacity
                onPress={handlePrevClick}
                style={{ marginRight: 20 }}
              >
                <AntDesign name="left" size={24} color="white" />
              </TouchableOpacity>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  {banner[0].other}
                </Text>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {banner[0].productName}
                </Text>
                <Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#c29920",
                    }}
                  >
                    R{banner[0].discountPrice}
                  </Text>{" "}
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 400,
                      color: "white",
                    }}
                  >
                    R{banner[0].originalPrice}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity onPress={handleNextClick}>
                <AntDesign name="right" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      )}
    </>
  );
}
