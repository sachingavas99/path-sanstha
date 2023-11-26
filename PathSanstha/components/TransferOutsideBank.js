import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "react-native-paper";
import { amountValidator, stringValidator } from "../core/util";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import axios from "axios";
import { useToast } from "react-native-paper-toast";
import { Avatar, Dialog } from "react-native-paper";
import { setUserData } from "../store/actions/user";
import { theme } from "../core/theme";
import { setBenificieryList } from "../store/actions/user";
import SelectDropdown from "react-native-select-dropdown";
import { Icon } from "react-native-elements";

export default function TransferOutsideBank(navigation) {
  const userData = useSelector((state) => state.userData.user);
  const [bnAccountNo, setBnAccountNo] = useState({ value: "", error: "" });
  const [ifscNo, setIfscNo] = useState({ value: "", error: "" });
  const [bankName, setBankName] = useState({ value: "", error: "" });
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
      email: userData.email_id,
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
            console.log(elm);
            benificieriesForSelect.push({
              ...{
                value: elm.ACCOUNT_CODE?.trim(),
                label: elm.ACCOUNT_CODE?.trim(),
                ifscCode: elm.IFSC_CODE?.trim(),
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
    const rtgsNeft = amountToTransfer.value >= 200000 ? "R" : "N";
    const data = {
      email: userData.email_id,
      rtgs_neft: rtgsNeft,
      amount: amountToTransfer.value,
      same_bank: "N",
      bene_account: bnAccountNo.value,
      bene_ifsc: ifscNo.value,
      bene_bankname: bankName.value,
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
            message: "Transfered failed!",
            duration: 2000,
            type: "error",
          });
        }
      })
      .catch(() => {
        toaster.show({
          message: "Transfered failed!",
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
      email: userData.email_id,
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
          dispatch(setUserData({ ...userData, ...data }));
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
      .catch(() => {
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
    const ifscNoError = stringValidator(ifscNo.value);
    const bankNameError = stringValidator(bankName.value);
    const amountToTransferError = amountValidator(amountToTransfer.value);
    let errorFound = false;

    if (bnAccountNoError) {
      setBnAccountNo({ ...bnAccountNo, error: bnAccountNoError });
      errorFound = true;
    }

    if (ifscNoError) {
      setIfscNo({ ...ifscNo, error: ifscNoError });
      errorFound = true;
    }

    if (bankNameError) {
      setBankName({ ...bankName, error: bankNameError });
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
          <View
            style={[
              styles.formDetailsRow,
              { zIndex: 999, elevation: 9999, height: 120 },
            ]}
          >
            <Text style={styles.formDetailsText}>Benificiery Account No.</Text>
            <View style={{ paddingTop: 10 }}>
              <SelectDropdown
                buttonStyle={styles.dropdown2BtnStyle}
                buttonTextStyle={styles.dropdown2BtnTxtStyle}
                dropdownStyle={styles.dropdown2DropdownStyle}
                rowStyle={styles.dropdown2RowStyle}
                rowTextStyle={styles.dropdown2RowTxtStyle}
                data={benificieryAccounts}
                defaultButtonText="Select an Beneficiary"
                onSelect={(selectedOption, index) => {
                  setBnAccountNo({ value: selectedOption.value, error: "" });
                  setIfscNo({ value: selectedOption.ifscCode, error: "" });
                  setSelectedBenificieryAccounts(selectedOption);
                }}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <Icon
                      name="chevron-circle-down"
                      type="font-awesome"
                      color="#fff"
                    ></Icon>
                  );
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem.value;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item.value;
                }}
              />
              {bnAccountNo.error ? (
                <Text style={[styles.formDetailsText, { color: "red" }]}>
                  Please select a Beneficiary.
                </Text>
              ) : (
                <Text style={[styles.formDetailsText, { color: "#F080BA" }]}>
                  {selectedBenificieryAccounts.BENIFESARY}
                </Text>
              )}
            </View>
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

          <View style={styles.formDetailsRow}>
            <Text style={styles.formDetailsText}>Bank Name.</Text>
            <TextInput
              returnKeyType="next"
              value={bankName.value}
              onChangeText={(text) => setBankName({ value: text, error: "" })}
              error={!!bankName.error}
              errorText={bankName.error}
              autoCapitalize="none"
              style={styles.textInput}
              mode="flat"
              dense={true}
            />
          </View>

          <View style={styles.formDetailsRow}>
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
