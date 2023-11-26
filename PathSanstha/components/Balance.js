import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";

export default function Balance(navigation) {
  const userData = useSelector((state) => state.userData.user);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar.Image
          size={240}
          source={require("../assets/header-image.png")}
        />
      </View>
      <ScrollView style={styles.subContainer}>
        <View>
          <View style={styles.accountDetailsRow}>
            <Text style={styles.accountDetailsText}>
              Account Name: {userData.name}
            </Text>
          </View>
          <View style={styles.accountDetailsRow}>
            <Text style={styles.accountDetailsText}>
              Account Type: {userData.account_type}
            </Text>
          </View>
        </View>

        <View style={styles.formWrapper}>
          <View style={styles.formDetailsRow}>
            <Text style={styles.formDetailsText}>Your Account Balance is</Text>
            <Text style={[styles.formDetailsText, styles.amountText]}>
              Rs. {userData.balance}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: StatusBar.currentHeight,
  },

  subContainer: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#030067",
    padding: 10,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  accountDetailsRow: {
    padding: 10,
  },

  formWrapper: {
    padding: 10,
  },

  formDetailsRow: {
    backgroundColor: "#FFF",
    height: 90,
    width: "100%",
    borderRadius: 10,
    padding: 10,
  },

  submitButtonWrapper: {
    backgroundColor: "#FFF",
    width: "100%",
    borderRadius: 10,
    padding: 10,
  },

  formDetailsText: {
    textAlign: "center",
    color: "#08074c",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 0,
  },

  amountText: {
    color: "#c1322f",
    paddingTop: 10,
  },

  submitButtonText: {
    textAlign: "center",
    color: "#08074c",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 0,
  },

  textInput: {
    borderBottomColor: "black",
    height: 30,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 1,
  },

  accountDetailsText: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 18,
    marginTop: 0,
  },

  text: {
    textAlign: "center",
    color: "#08074c",
    fontWeight: "bold",
    fontSize: 28,
    marginTop: 0,
  },

  subContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    backgroundColor: "#FFF",
    height: 200,
    borderRadius: 10,
    width: "100%",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  break: {
    flexBasis: "100%",
    height: 0,
  },

  image: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
    resizeMode: "contain",
  },
});
