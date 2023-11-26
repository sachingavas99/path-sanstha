import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import Button from "./Button";
import { useSelector } from "react-redux";
import { TextInput } from "react-native-paper";
import { stringValidator, benificieryNameValidator } from "../core/util";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import axios from "axios";
import { useToast } from "react-native-paper-toast";
import { Avatar, Dialog } from "react-native-paper";
import { theme } from "../core/theme";

export default function AddBenificiery(navigation) {
  const userData = useSelector((state) => state.userData.user);
  const [benificieryName, setBenificieryName] = useState({
    value: "",
    error: "",
  });
  const [benificieryAccount, setBenificieryAccount] = useState({
    value: "",
    error: "",
  });
  const [ifscNo, setIfscNo] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);
  const toaster = useToast();
  const [showDialog, setShowDialog] = useState(false);

  const callAddBenificieryApi = async () => {
    const data = {
      email: userData.email_id,
      bene_account: benificieryAccount.value,
      bene_ifsc: ifscNo.value,
      bene_name: benificieryName.value,
    };

    setLoading(true);
    axios({
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      url: "http://59.97.238.86:8080/webbank.java/servlet/MobileAddBene",
      data: data,
    })
      .then(function (response) {
        const { data } = response;
        if (data.message == "Success") {
          toaster.show({
            message: "Benificiery added successfully!",
            duration: 2000,
            type: "success",
          });
          navigation.navigation.navigate("BeneficieryList");
        } else {
          toaster.show({
            message: "Add Benificiery failed!",
            duration: 2000,
            type: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        toaster.show({
          message: "Add Benificiery failed!",
          duration: 2000,
          type: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validateForm = () => {
    const benificieryNameError = benificieryNameValidator(
      benificieryName.value
    );
    const ifscNoError = stringValidator(ifscNo.value);
    const benificieryAccountError = stringValidator(benificieryAccount.value);
    let errorFound = false;

    if (benificieryNameError) {
      setBenificieryName({ ...benificieryName, error: benificieryNameError });
      errorFound = true;
    }

    if (ifscNoError) {
      setIfscNo({ ...ifscNo, error: ifscNoError });
      errorFound = true;
    }

    if (benificieryAccountError) {
      setBenificieryAccount({
        ...benificieryAccount,
        error: benificieryAccountError,
      });
      errorFound = true;
    }

    return errorFound;
  };

  const submitData = () => {
    const errorFound = validateForm();
    if (!errorFound) {
      callAddBenificieryApi();
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
        <View style={styles.formWrapper}>
          <View style={styles.formDetailsRow}>
            <Text style={styles.formDetailsText}>Benificiery Name.</Text>
            <TextInput
              returnKeyType="next"
              value={benificieryName.value}
              onChangeText={(text) =>
                setBenificieryName({ value: text, error: "" })
              }
              error={!!benificieryName.error}
              errorText={benificieryName.error}
              autoCapitalize="none"
              style={styles.textInput}
              mode="flat"
              dense={true}
            />
          </View>

          <View style={styles.formDetailsRow}>
            <Text style={styles.formDetailsText}>
              Benificiery Account Number.
            </Text>
            <TextInput
              returnKeyType="next"
              value={benificieryAccount.value}
              onChangeText={(text) =>
                setBenificieryAccount({ value: text, error: "" })
              }
              error={!!benificieryAccount.error}
              errorText={benificieryAccount.error}
              autoCapitalize="none"
              style={styles.textInput}
              mode="flat"
              dense={true}
            />
          </View>

          <View style={styles.formDetailsRow}>
            <Text style={styles.formDetailsText}>Bank IFSC No.</Text>
            <TextInput
              returnKeyType="next"
              value={ifscNo.value}
              onChangeText={(text) => setIfscNo({ value: text, error: "" })}
              error={!!ifscNo.error}
              errorText={ifscNo.error}
              autoCapitalize="none"
              style={styles.textInput}
              mode="flat"
              dense={true}
            />
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
              CONFIRM TO ADD BENIFICIERY
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
