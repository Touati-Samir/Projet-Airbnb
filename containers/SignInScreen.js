import { useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Colors
import colors from "../assets/colors";

// Components
import Button from "../components/Button";
import Message from "../components/Message";
import Input from "../components/Input";
import Logo from "../components/Logo";
import RedirectButton from "../components/RedirectButton";
import ScreenTitle from "../components/ScreenTitle";

function SignInScreen({ setTokenAndId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async () => {
    if (email && password) {
      if (errorMessage !== null) {
        setErrorMessage(null);
      }

      try {
        const { data } = await axios.post(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in`,
          {
            email,
            password,
          }
        );

        if (data.token && data.id) {
          setTokenAndId(data.token, data.id);
        } else {
          setErrorMessage("An error occurred");
        }
      } catch (error) {
        if (error.response.status === 401) {
          setErrorMessage("Incorrect credentials");
        } else {
          setErrorMessage("An error occurred");
        }
      }
    } else {
      setErrorMessage("Please fill all fields");
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
      />

      <KeyboardAwareScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.view}>
          <Logo size={"large"} />
          <ScreenTitle title={"Sign in"} />
        </View>

        <View style={styles.view}>
          <Input
            setFunction={setEmail}
            keyboardType={"email-address"}
            placeholder={"email"}
            value={email}
          />
          <Input
            setFunction={setPassword}
            secureTextEntry={true}
            placeholder={"password"}
            value={password}
          />
        </View>

        <View style={styles.view}>
          <Message message={errorMessage} color="error" />
          <Button text="Sign in" setFunction={handleSubmit} />
          <RedirectButton text="No account ? Register" screen="SignUp" />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: colors.bgColor,
    flex: 1,
  },
  scrollView: {
    backgroundColor: colors.bgColor,
    alignItems: "center",
    justifyContent: "space-around",
    height: "100%",
  },
  view: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
