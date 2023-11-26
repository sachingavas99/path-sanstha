import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function HeadingImage() {
  return (
    <View style={styles.container}>
      <Text>HeadingImage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
