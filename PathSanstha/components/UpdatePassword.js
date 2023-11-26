import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "react-native-paper";
import { amountValidator, passwordValidator } from "../core/util";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import axios from "axios";
import { useToast } from "react-native-paper-toast";
import { Avatar, Dialog } from "react-native-paper";
import { setUserData } from "../store/actions/user";
import { theme } from "../core/theme";
import { setBenificieryList } from "../store/actions/user";
import SelectDropdown from "react-native-select-dropdown";
import { Icon } from "react-native-elements";

export default function UpdatePassword(navigation) {
  const userData = useSelector((state) => state.userData.user);

  const [oldPassword, setOldPassword] = useState({ value: "", error: "" });
  const [newPassword, setNewPassword] = useState({ value: "", error: "" });
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    error: "",
  });

  const [loading, setLoading] = useState(false);
  const toaster = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();

  const callTransferApi = async () => {
    const data = {
      email: userData.email_id,
      password: oldPassword.value,
      same_bank: newPassword.value,
      type: "P",
    };

    setLoading(true);
    axios({
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      url: "http://59.97.238.86:8080/webbank.java/servlet/GetInformation",
      data: data,
    })
      .then(function (response) {
        const body = response.data || {};
        if (body.message == "Success") {
          toaster.show({
            message: "Password successfully!",
            duration: 2000,
            type: "success",
          });
        } else {
          toaster.show({
            message: "Password updation failed!",
            duration: 2000,
            type: "error",
          });
        }
      })
      .catch(() => {
        toaster.show({
          message: "Password updation failed!",
          duration: 2000,
          type: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validateForm = () => {
    const oldPasswordError = passwordValidator(oldPassword.value);
    const newPasswordError = passwordValidator(newPassword.value);
    const confirmPasswordError = passwordValidator(confirmPassword.value);

    let errorFound = false;

    if (oldPasswordError) {
      setOldPassword({ ...oldPassword, error: oldPasswordError });
      errorFound = true;
    }

    if (newPasswordError) {
      setNewPassword({ ...newPassword, error: newPasswordError });
      errorFound = true;
    }

    if (confirmPasswordError) {
      setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
      errorFound = true;
    } else if (newPassword.value != confirmPassword.value) {
      setConfirmPassword({
        ...confirmPassword,
        error: "Password does not match",
      });
      errorFound = true;
    }

    return errorFound;
  };

  const submitData = () => {
    const errorFound = validateForm();
    if (!errorFound) {
      callTransferApi();
    }
  };

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
          size={140}
          source={require("../assets/header-image.png")}
        />
      </View>
      <StatusBar style="auto" />
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
            <Text style={styles.formDetailsText}>Old Password</Text>
            <TextInput
              returnKeyType="next"
              value={oldPassword.value}
              onChangeText={(text) =>
                setOldPassword({ value: text, error: "" })
              }
              error={!!oldPassword.error}
              errorText={oldPassword.error}
              autoCapitalize="none"
              style={styles.textInput}
              mode="flat"
              secureTextEntry
              dense={true}
            />
            {!!oldPassword.error && (
              <Text
                style={[styles.formDetailsText, { color: "red", fontSize: 12 }]}
              >
                {oldPassword.error}
              </Text>
            )}
          </View>

          <View style={styles.formDetailsRow}>
            <Text style={styles.formDetailsText}>New Password</Text>
            <TextInput
              returnKeyType="next"
              value={newPassword.value}
              onChangeText={(text) =>
                setNewPassword({ value: text, error: "" })
              }
              error={!!newPassword.error}
              errorText={newPassword.error}
              autoCapitalize="none"
              style={styles.textInput}
              mode="flat"
              secureTextEntry
              dense={true}
            />
            {!!newPassword.error && (
              <Text
                style={[styles.formDetailsText, { color: "red", fontSize: 12 }]}
              >
                {newPassword.error}
              </Text>
            )}
          </View>

          <View style={styles.formDetailsRow}>
            <Text style={styles.formDetailsText}>Confirm Password</Text>
            <TextInput
              returnKeyType="next"
              value={confirmPassword.value}
              onChangeText={(text) =>
                setConfirmPassword({ value: text, error: "" })
              }
              error={!!confirmPassword.error}
              errorText={confirmPassword.error}
              autoCapitalize="none"
              style={styles.textInput}
              mode="flat"
              secureTextEntry
              dense={true}
            />
            {!!confirmPassword.error && (
              <Text
                style={[styles.formDetailsText, { color: "red", fontSize: 12 }]}
              >
                {confirmPassword.error}
              </Text>
            )}
          </View>

          <Button
            mode="contained"
            style={{ marginTop: 20 }}
            onPress={() => {
              const errorFound = validateForm();
              if (!errorFound) {
                setShowDialog(true);
              }
            }}
          >
            <Text style={{ fontSize: 20 }}>Submit</Text>
          </Button>
        </View>
      </ScrollView>
      <OrientationLoadingOverlay
        visible={loading}
        color="white"
        indicatorSize="large"
        messageFontSize={24}
        message="Processing to transfer..."
      />

      <Dialog visible={showDialog}>
        <Dialog.Content>
          <View style={{ alignItems: "center", width: "100%" }}>
            <Text
              style={{
                fontSize: 20,
                color: "#08074c",
                fontWeight: "bold",
              }}
            >
              CONFIRM TO CHANGE PASSWORD
            </Text>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 5, alignItems: "center" }}>
              <View style={{ width: 110 }}>
                <Button
                  mode="contained"
                  onPress={() => setShowDialog(false)}
                  style={{ backgroundColor: theme.colors.secondary }}
                >
                  Cancel
                </Button>
              </View>
            </View>
            <View style={{ flex: 5, alignItems: "center" }}>
              <View style={{ width: 110 }}>
                <Button
                  mode="contained"
                  onPress={() => {
                    submitData();
                    setShowDialog(false);
                  }}
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  Ok
                </Button>
              </View>
            </View>
          </View>
        </Dialog.Actions>
      </Dialog>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdown2BtnStyle: {
    width: "100%",
    height: 50,
    backgroundColor: "#444",
    borderRadius: 8,
    textAlign: "left",
  },
  dropdown2BtnTxtStyle: {
    color: "#FFF",
    textAlign: "left",
    fontWeight: "bold",
  },
  dropdown2DropdownStyle: {
    color: "#FFF",
    textAlign: "left",
    fontWeight: "bold",
  },
  dropdown2DropdownStyle: { backgroundColor: "#444", textAlign: "left" },
  dropdown2RowStyle: {
    backgroundColor: "#444",
    borderBottomColor: "#C5C5C5",
    textAlign: "left",
  },
  dropdown2RowTxtStyle: {
    color: "#FFF",
    textAlign: "left",
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
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
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
    // borderBottomColor: "black",
    // height: 30,
    // padding: 10,
    // marginLeft: 10,
    // marginRight: 10,
    // borderBottomWidth: 1,
    backgroundColor: "transparent",
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
