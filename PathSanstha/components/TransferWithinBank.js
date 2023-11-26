import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { TextInput, Avatar, Dialog } from "react-native-paper";
import { amountValidator, stringValidator } from "../core/util";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import axios from "axios";
import { useToast } from "react-native-paper-toast";
import { setUserData } from "../store/actions/user";
import { theme } from "../core/theme";
import { setBenificieryList } from "../store/actions/user";
import SelectDropdown from "react-native-select-dropdown";
import { Icon } from "react-native-elements";

export default function TransferWithinBank(navigation) {
  const userData = useSelector((state) => state.userData);
  const benificieries = useSelector((state) => state.userData.benificieries);
  const [bnAccountNo, setBnAccountNo] = useState({ value: "", error: "" });
  const [amountToTransfer, setAmountToTransfer] = useState({
    value: "",
    error: "",
  });
  const [loading, setLoading] = useState(false);
  const toaster = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();
  const [benificieryAccounts, setBenificieryAccounts] = useState([]);
  const [selectedBenificieryAccounts, setSelectedBenificieryAccounts] =
    useState({});

  const fetchBeneficieries = async () => {
    const data = {
      email: userData.user.email_id,
      type: "B",
    };

    setLoading(true);
    axios({
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      url: "http://59.97.238.86:8080/webbank.java/servlet/MobileStatement",
      data: data,
    })
      .then(function (response) {
        const statementData = response.data || {};
        if (statementData?.statement) {
          const statement = statementData.statement.replace(",]", "]");
          const arrStatement = JSON.parse(statement);
          dispatch(setBenificieryList({ BenificieryList: arrStatement }));
          const benificieriesForSelect = [];
          arrStatement.forEach((elm) => {
            benificieriesForSelect.push({
              ...{
                value: elm.ACCOUNT_CODE?.trim(),
                label: elm.ACCOUNT_CODE?.trim(),
              },
              ...elm,
            });
          });
          setBenificieryAccounts([...benificieriesForSelect]);
        }

        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        toaster.show({
          message: "Failed while fetching beneficieries..",
          duration: 2000,
          type: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const callTransferApi = async () => {
    const data = {
      email: userData.user.email_id,
      amount: amountToTransfer.value,
      same_bank: "Y",
      bene_account: bnAccountNo.value,
    };

    setLoading(true);
    axios({
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      url: "http://59.97.238.86:8080/webbank.java/servlet/MobileTrasnaction",
      data: data,
    })
      .then(function (response) {
        const body = response.data || {};
        if (body.message == "Success") {
          toaster.show({
            message: "Transfered successfully!",
            duration: 2000,
            type: "success",
          });
        } else {
          toaster.show({
            message: "Transfered failed! 1",
            duration: 2000,
            type: "error",
          });
        }
      })
      .catch(() => {
        toaster.show({
          message: "Transfered failed! 2",
          duration: 2000,
          type: "error",
        });
      })
      .finally(() => {
        setLoading(false);
        fetchAccountDetails();
      });
  };

  const fetchAccountDetails = async () => {
    const data = {
      email: userData.user.email_id,
    };

    setLoading(true);
    axios({
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      url: "http://59.97.238.86:8080/webbank.java/servlet/MobileAccountDetails",
      data: data,
    })
      .then(function (response) {
        const body = response.data || {};
        if (body.name != "") {
          const data = {
            name: body.name,
            account_type: body.account_type,
            balance: body.balance,
            phonemobile: body.phonemobile,
            address1: body.address1,
            address2: body.address2,
            address3: body.address3,
            city: body.city,
            zip: body.zip,
          };
          dispatch(setUserData({ ...userData.user, ...data }));
        } else {
          toaster.show({
            message: "Failed while fetching account details..",
            duration: 2000,
            type: "error",
          });
          navigation.navigation.navigate("Login");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toaster.show({
          message: "Failed while fetching account details..",
          duration: 2000,
          type: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validateForm = () => {
    const bnAccountNoError = stringValidator(bnAccountNo.value);
    const amountToTransferError = amountValidator(amountToTransfer.value);
    let errorFound = false;

    if (bnAccountNoError) {
      setBnAccountNo({ ...bnAccountNo, error: bnAccountNoError });
      errorFound = true;
    }

    if (amountToTransferError) {
      setAmountToTransfer({
        ...amountToTransfer,
        error: amountToTransferError,
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

  useEffect(() => {
    fetchBeneficieries();
  }, []);

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

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
              Account Name: {userData.user.name}
            </Text>
          </View>
          <View style={styles.accountDetailsRow}>
            <Text style={styles.accountDetailsText}>
              Account Type: {userData.user.account_type}
            </Text>
          </View>
        </View>

        <View style={styles.formWrapper}>
          <View
            style={[
              styles.formDetailsRow,
              { zIndex: 999, elevation: 9999, height: 110 },
            ]}
          >
            <Text style={styles.formDetailsText}>Benificiary Account No.</Text>
            <View>
              <TextInput
                returnKeyType="next"
                value={bnAccountNo.value}
                onChangeText={(text) =>
                  setBnAccountNo({ value: text, error: "" })
                }
                error={!!bnAccountNo.error}
                errorText={bnAccountNo.error}
                autoCapitalize="none"
                style={styles.textInput}
                mode="flat"
                dense={true}
              />
              {!!bnAccountNo.error && (
                <Text style={[styles.formDetailsText, { color: "red" }]}>
                  Please add a valid beneficiary.
                </Text>
              )}
            </View>
          </View>

          <View style={[styles.formDetailsRow, { height: 110 }]}>
            <Text style={styles.formDetailsText}>Amount to Transfer.</Text>
            <TextInput
              returnKeyType="next"
              value={amountToTransfer.value}
              onChangeText={(text) =>
                setAmountToTransfer({ value: text, error: "" })
              }
              error={!!amountToTransfer.error}
              errorText={amountToTransfer.error}
              autoCapitalize="none"
              style={styles.textInput}
              mode="flat"
              dense={true}
            />
            {!!amountToTransfer.error && (
              <Text style={[styles.formDetailsText, { color: "red" }]}>
                Please enter a valid amount.
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
              CONFIRM TRANSACTION
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
