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
import LargeInput from "../components/LargeInput";
import Logo from "../components/Logo";
import RedirectButton from "../components/RedirectButton";
import ScreenTitle from "../components/ScreenTitle";

function SignUpScreen({ setTokenAndId }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async () => {
    if (email && username && description && password && confirmPassword) {
      if (password === confirmPassword) {
        if (errorMessage !== null) {
          setErrorMessage(null);
        }

        try {
          const { data } = await axios.post(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/sign_up`,
            { email, username, description, password }
          );

          if (data.token && data.id) {
            setTokenAndId(data.token, data.id);
          } else {
            setErrorMessage("An error occurred");
          }
        } catch (error) {
          const errorMessage = error.response.data.error;
          if (
            errorMessage === "This email already has an account." ||
            errorMessage === "This username already has an account."
          ) {
            setErrorMessage(errorMessage);
          } else {
            setErrorMessage("An error occurred");
          }
        }
      } else {
        setErrorMessage("Passwords must be the same");
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

      <KeyboardAwareScrollView
        style={styles.keyboard}
        contentContainerStyle={styles.scrollView}
      >
        <Logo size={"large"} />
        <ScreenTitle title="Sign up" />
        <Input
          keyboardType="email-address"
          placeholder="email"
          setFunction={setEmail}
          value={email}
        />

        <Input
          placeholder="username"
          setFunction={setUsername}
          value={username}
        />
        <LargeInput
          setFunction={setDescription}
          placeholder={"Describe yourself in a few words..."}
          value={description}
        />
        <Input
          placeholder="password"
          secureTextEntry={true}
          setFunction={setPassword}
          value={password}
        />
        <Input
          placeholder="confirm password"
          secureTextEntry={true}
          setFunction={setConfirmPassword}
          value={confirmPassword}
        />
        <View style={styles.view}>
          <Message message={errorMessage} color="error" />
          <Button text="Sign up" setFunction={handleSubmit} />
          <RedirectButton
            text="Already have an account? Sign in"
            screen="SignIn"
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  scrollView: {
    backgroundColor: colors.bgColor,
    alignItems: "center",
    justifyContent: "center",
  },
  keyboard: {
    color: colors.bgColor,
  },
  view: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
