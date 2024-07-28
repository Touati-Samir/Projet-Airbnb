import { Image, StyleSheet, View, Platform } from "react-native";

function Logo({ size }) {
  return (
    <View style={Platform.OS === "android" && styles.androidCenter}>
      <Image
        source={require("../assets/logo.png")}
        style={size === "large" ? styles.largeLogo : styles.smallLogo}
        resizeMode={"contain"}
      />
    </View>
  );
}

export default Logo;

const styles = StyleSheet.create({
  largeLogo: {
    height: 100,
    width: 100,
    marginTop: 10,
    marginBottom: 30,
  },
  smallLogo: {
    height: 30,
    width: 30,
  },
  androidCenter: {
    alignItems: "center",
    justifyContent: "center",
    width: "96%",
  },
});
