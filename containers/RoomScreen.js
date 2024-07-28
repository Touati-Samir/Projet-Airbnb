import { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

// Colors
import colors from "../assets/colors";

// Components
import Informations from "../components/Informations";
import PriceView from "../components/PriceView";

import Swiper from "react-native-swiper";

function RoomScreen({ route }) {
  const [displayAllText, setDisplayAllText] = useState(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${route.params.id}`
        );
        setData(data);

        setIsloading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator
      color={colors.pink}
      size="large"
      style={styles.activityIndicator}
    />
  ) : (
    <ScrollView style={styles.scrollView}>
      <View style={styles.relative}>
        <View>
          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            autoplay={true}
            dotColor="salmon"
            activeDotColor="red"
            buttonColor="yellow"
          >
            {data.photos.map((slide) => {
              return (
                <View style={styles.slide} key={slide.picture_id}>
                  <Image source={{ uri: slide.url }} style={styles.img} />
                </View>
              );
            })}
          </Swiper>
        </View>

        <View style={styles.absolute}>
          <PriceView price={data.price} />
        </View>
      </View>

      <View style={styles.margin}>
        <Informations
          title={data.title}
          photo={data.user.account.photo.url}
          reviews={data.reviews}
        />
      </View>

      <TouchableOpacity
        style={styles.description}
        onPress={() => {
          setDisplayAllText(!displayAllText);
        }}
      >
        <Text
          numberOfLines={displayAllText === false ? 3 : null}
          style={styles.description}
        >
          {data.description}
        </Text>
      </TouchableOpacity>

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: data.location[1],
          longitude: data.location[0],
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker
          coordinate={{
            latitude: data.location[1],
            longitude: data.location[0],
          }}
          title={data.title}
        />
      </MapView>
    </ScrollView>
  );
}

export default RoomScreen;

const styles = StyleSheet.create({
  activityIndicator: {
    paddingTop: 20,
  },
  scrollView: {
    backgroundColor: colors.bgColor,
  },
  img: { height: "100%", width: "100%" },
  relative: {
    position: "relative",
  },
  absolute: {
    position: "absolute",
    bottom: 0,
  },
  description: {
    marginHorizontal: 10,
    lineHeight: 20,
    marginBottom: 10,
  },
  margin: {
    marginHorizontal: 20,
  },
  map: {
    height: 300,
    width: "100%",
  },
  wrapper: {
    height: 240,
  },
  slide: {
    height: 240,
  },
});
