import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Pressable,
} from "react-native";
import { Icon } from "react-native-elements";

export default function DrawerContent(props) {
  return (
    <View style={styles.controlPanel}>
      <View style={styles.headerStrip}>
        <Pressable onPress={props.closeDrawer}>
          <Icon name="times-circle" type="font-awesome" color="#342D73"></Icon>
        </Pressable>
      </View>
      <View style={styles.menuItemSeperator}></View>

      <Pressable
        onPress={() => {
          props.navigate.current.navigate("UpdatePassword");
          props.closeDrawer();
        }}
      >
        <View style={styles.menus}>
          <Icon name="gears" type="font-awesome" color="#342D73"></Icon>
          <Text style={styles.menuItem}>Update Password</Text>
        </View>
      </Pressable>
      <View style={styles.menuItemSeperator}></View>

      <Pressable
        onPress={() => {
          props.navigate.current.navigate("TransferWithinBank");
          props.closeDrawer();
        }}
      >
        <View style={styles.menus}>
          <Icon
            name="bank-transfer-in"
            type="material-community"
            color="#342D73"
          ></Icon>
          <Text style={styles.menuItem}>Transfer Within Bank</Text>
        </View>
      </Pressable>
      <View style={styles.menuItemSeperator}></View>

      <Pressable
        onPress={() => {
          props.navigate.current.navigate("TransferOutsideBank");
          props.closeDrawer();
        }}
      >
        <View style={styles.menus}>
          <Icon
            name="bank-transfer-out"
            type="material-community"
            color="#342D73"
          ></Icon>
          <Text style={styles.menuItem}>Transfer Outside Bank</Text>
        </View>
      </Pressable>
      <View style={styles.menuItemSeperator}></View>

      <Pressable
        onPress={() => {
          props.navigate.current.navigate("Balance");
          props.closeDrawer();
        }}
      >
        <View style={styles.menus}>
          <Icon name="account-balance" type="material" color="#342D73"></Icon>
          <Text style={styles.menuItem}>Check Balance</Text>
        </View>
      </Pressable>
      <View style={styles.menuItemSeperator}></View>

      <Pressable
        onPress={() => {
          props.navigate.current.navigate("Ledger");
          props.closeDrawer();
        }}
      >
        <View style={styles.menus}>
          <Icon name="print" type="fontisto" color="#342D73"></Icon>
          <Text style={styles.menuItem}>Get Ledger</Text>
        </View>
      </Pressable>
      <View style={styles.menuItemSeperator}></View>

      <Pressable
        onPress={() => {
          props.navigate.current.navigate("MyAccounts");
          props.closeDrawer();
        }}
      >
        <View style={styles.menus}>
          <Icon name="account" type="material-community" color="#342D73"></Icon>
          <Text style={styles.menuItem}>My Account</Text>
        </View>
      </Pressable>
      <View style={styles.menuItemSeperator}></View>

      <Pressable
        onPress={() => {
          props.navigate.current.navigate("AddBenificiery");
          props.closeDrawer();
        }}
      >
        <View style={styles.menus}>
          <Icon name="add-circle-outline" type="ionicon" color="#342D73"></Icon>
          <Text style={styles.menuItem}>Add Benificiery</Text>
        </View>
      </Pressable>
      <View style={styles.menuItemSeperator}></View>

      <Pressable
        onPress={() => {
          props.navigate.current.navigate("Login");
          props.closeDrawer();
        }}
      >
        <View style={styles.menus}>
          <Icon name="logout" type="material" color="#342D73"></Icon>
          <Text style={styles.menuItem}>Logout</Text>
        </View>
      </Pressable>
      <View style={styles.menuItemSeperator}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  menus: {
    display: "flex",
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
  },
  menuItem: {
    textAlign: "center",
    color: "#08074c",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 0,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  menuItemSeperator: {
    borderBottomWidth: 1,
    borderBottomColor: "#08074c",
  },
  headerStrip: {
    alignItems: "flex-end",
    padding: 5,
    paddingBottom: 10,
  },
  controlPanel: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: "#F2F2F2",
  },
  controlPanelText: {
    color: "white",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 25,
  },
  controlPanelWelcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 25,
    color: "black",
    fontWeight: "bold",
  },
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
    marginTop: 10,
  },

  submitButtonWrapper: {
    backgroundColor: "#FFF",
    width: "100%",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },

  formDetailsText: {
    textAlign: "center",
    color: "#08074c",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 0,
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
