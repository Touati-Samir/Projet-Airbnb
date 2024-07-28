import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

// Colors & Icons
import colors from "../assets/colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

// Components
import Button from "../components/Button";
import Input from "../components/Input";
import LargeInput from "../components/LargeInput";
import Message from "../components/Message";

function ProfileScreen({ userToken, userId, setTokenAndId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [displayMessage, setDisplayMessage] = useState(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState(null);
  const [isPictureModified, setIsPictureModified] = useState(false);
  const [isInfosModified, setIsInfosModified] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      );

      setUserName(data.username);
      setEmail(data.email);
      setDescription(data.description);

      if (data.photo) {
        setPicture(data.photo.url);
      }

      setIsLoading(false);
    } catch (error) {
      setDisplayMessage({
        message: "An error occurred",
        color: "error",
      });
    }
  };

  // update informations
  const editInformations = async () => {
    setDisplayMessage(false);

    if (isPictureModified || isInfosModified) {
      setIsLoading(true);

      // send request to update picture
      if (isPictureModified) {
        try {
          const uri = picture;
          const uriParts = uri.split(".");
          const fileType = uriParts.at(-1);

          const formData = new FormData();
          formData.append("photo", {
            uri,
            name: `userPicture.${fileType}`,
            type: `image/${fileType}`,
          });

          const { data } = await axios.put(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/upload_picture`,
            formData,
            {
              headers: {
                Authorization: "Bearer " + userToken,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (data) {
            setPicture(data.photo?.url);

            setDisplayMessage({
              message: "Your profile has been updated",
              color: "success",
            });
          }
        } catch (error) {
          setDisplayMessage({
            message: error.response.data.error,
            color: "error",
          });
        }
      }

      // send request to update informations (except picture)
      if (isInfosModified) {
        try {
          const body = {
            email: email,
            username: userName,
            description: description,
          };

          const { data } = await axios.put(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/update`,
            body,
            {
              headers: {
                Authorization: "Bearer " + userToken,
              },
            }
          );

          if (data) {
            setUserName(data.username);
            setEmail(data.email);
            setDescription(data.description);

            setDisplayMessage({
              message: "Your profile has been updated",
              color: "success",
            });
          } else {
            setDisplayMessage({
              message: "An error occurred",
              color: "error",
            });
          }
        } catch (error) {
          setDisplayMessage({
            message: error.response.data.error,
            color: "error",
          });
        }
      }

      isPictureModified && setIsPictureModified(false);
      isInfosModified && setIsInfosModified(false);

      setIsLoading(false);
    } else {
      setDisplayMessage({
        message: "Change at least one information",
        color: "error",
      });
    }
  };

  // get picture from image library
  const uploadPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled) {
        setPicture(result.assets[0].uri);

        if (!isPictureModified) {
          setIsPictureModified(true);
        }
      }
    }
    setDisplayMessage(false);
  };

  // get picture from camera
  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();

      if (!result.canceled) {
        setPicture(result.assets[0].uri);

        if (!isPictureModified) {
          setIsPictureModified(true);
        }
      }
    }
    setDisplayMessage(false);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar barStyle="dark-content" />

      {isLoading ? (
        <ActivityIndicator
          color={colors.pink}
          size="large"
          style={styles.activityIndicator}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.topView}>
            <TouchableOpacity style={styles.pictureView}>
              {picture ? (
                <Image
                  source={{ uri: picture }}
                  style={styles.picture}
                  resizeMode="cover"
                />
              ) : (
                <FontAwesome5
                  name="user-alt"
                  size={100}
                  color={colors.lightGrey}
                />
              )}
            </TouchableOpacity>
            <View style={styles.icons}>
              <TouchableOpacity
                onPress={() => {
                  uploadPicture();
                }}
              >
                <MaterialIcons
                  name="photo-library"
                  size={30}
                  color={colors.grey}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  takePicture();
                }}
              >
                <FontAwesome5 name="camera" size={30} color={colors.grey} />
              </TouchableOpacity>
            </View>
          </View>

          <Input
            value={email}
            setFunction={setEmail}
            setDisplayMessage={setDisplayMessage}
            setIsInfosModified={setIsInfosModified}
          />
          <Input
            value={userName}
            setFunction={setUserName}
            setDisplayMessage={setDisplayMessage}
            setIsInfosModified={setIsInfosModified}
          />
          <LargeInput
            value={description}
            setFunction={setDescription}
            setDisplayMessage={setDisplayMessage}
            setIsInfosModified={setIsInfosModified}
          />

          <View style={styles.view}>
            {displayMessage && (
              <Message
                message={displayMessage.message}
                color={displayMessage.color}
              />
            )}
          </View>

          <Button text="Update" setFunction={editInformations} />
          <Button
            text="Log out"
            setFunction={() => {
              setTokenAndId(null, null);
            }}
            backgroundColor={true}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  scrollView: {
    alignItems: "center",
    backgroundColor: colors.bgColor,
  },
  picture: {
    height: 150,
    width: 150,
    borderRadius: 150,
  },
  pictureView: {
    marginVertical: 20,
    width: 170,
    height: 170,
    borderRadius: 170,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.lightPink,
    borderWidth: 2,
  },
  topView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  icons: {
    marginLeft: 20,
  },
  iconButton: {
    marginTop: 40,
  },
  view: {
    height: 30,
  },
});
