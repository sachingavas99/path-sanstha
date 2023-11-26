import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "react-native-paper";
import { useToast } from "react-native-paper-toast";
import { setUserData, setMyToolTip } from "../store/actions/user";
import axios from "axios";
import NotificationPopup from "react-native-push-notification-popup";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";

export default function OptionsSelection(navigation) {
  const userData = useSelector((state) => state.userData.user);
  const myToolTip = useSelector((state) => state.userData.myToolTip);
  const popup = useRef(null);
  const [loading, setLoading] = useState(false);
  const toaster = useToast();
  const dispatch = useDispatch();
  const { width, height } = Dimensions.get("window");

  const onPressHandler = (screen) => {
    navigation.navigation.navigate(screen);
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

  const fetchToolTip = async () => {
    const data = {
      email: userData.email_id,
      type: "R",
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
          dispatch(setMyToolTip({ myToolTip: statementData?.statement }));
        }
        setLoading(false);
        setTimeout(() => {
          showPopup();
        }, 3000);
      })
      .catch((e) => {
        console.error(e);
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

  const showPopup = () => {
    popup.current.show({
      slideOutTime: 5000000,
    });
  };

  useEffect(() => {
    fetchAccountDetails();
    fetchToolTip();
  }, []);

  const renderCustomPopup = ({
    appIconSource,
    appTitle,
    timeText,
    title,
    body,
  }) => (
    <View style={{ top: 0 }}>
      <View
        style={[
          styles.textContainer,
          { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
        ]}
      >
        <Text style={[styles.text, { fontSize: 15 }]}>{myToolTip}</Text>
      </View>
      <Button title="Okay" onPress={() => popup.current.slideOutAndDismiss()} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={[
            styles.textContainer,
            { height: "auto", padding: 0, paddingBottom: 10 },
          ]}
        >
          <Image
            source={require("../assets/headerImage.png")}
            resizeMode="contain"
            style={{
              height: undefined,
              aspectRatio: 299 / 280,
              // width: width,
              width: "100%",
            }}
          />
          {/* <Avatar.Image
            style={{ width: "400", borderRadius: 0 }}
            source={require("../assets/headerImage.png")}
          /> */}
          {/* <ResponsiveImage
            source={require("../assets/headerImage.png")}
            initWidth="400"
            initHeight="400"
          /> */}

          {/* <AspectImage
            style={{ flexGrow: 1 }}
            source={require("../assets/headerImage.png")}
            placeholder={<Text>loading</Text>}
          /> */}

          {/* <Text style={[styles.text, { color: "#eb499f" }]}>WELLCOME</Text>
          <Text style={styles.text}>Shree Ravalnath Co-op</Text>
          <Text style={styles.text}>Housing Fianance</Text>
          <Text style={styles.text}>Society Ltd. Ajara.</Text>

          <Text style={[styles.text, { fontSize: 15, color: "#6c80a4" }]}>
            (Multi-State)
          </Text> */}
        </View>
      </View>
      <StatusBar style="auto" />
      <ScrollView style={{ width: "100%", paddingLeft: 10, paddingRight: 10 }}>
        <View style={[styles.subContainer]}>
          <View style={{ flex: 5, flexDirection: "column", marginRight: 10 }}>
            <TouchableOpacity
              style={styles.subContent}
              onPress={(e) => onPressHandler("TransferWithinBank")}
            >
              <View style={styles.textContainer}>
                <Text style={styles.text}>Transfer within Bank</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.subContent, { marginTop: 20 }]}
              onPress={(e) => onPressHandler("Balance")}
            >
              <View style={styles.textContainer}>
                <Text style={styles.text}>Check Balance</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subContent, { marginTop: 20 }]}
              onPress={(e) => onPressHandler("BeneficieryList")}
            >
              <View style={styles.textContainer}>
                <Text style={styles.text}>Manage Beneficiary</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 5, flexDirection: "column", marginLeft: 10 }}>
            <TouchableOpacity
              style={styles.subContent}
              onPress={(e) => onPressHandler("TransferOutsideBank")}
            >
              <View style={styles.textContainer}>
                <Text style={styles.text}>Transfer Outside Bank</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.subContent, { marginTop: 20 }]}
              onPress={(e) => onPressHandler("Ledger")}
            >
              <View style={styles.textContainer}>
                <Text style={styles.text}>Get Ledger</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.subContent, { marginTop: 20 }]}
              onPress={(e) => onPressHandler("MyAccounts")}
            >
              <View style={styles.textContainer}>
                <Text style={styles.text}>My Accounts</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <OrientationLoadingOverlay
        visible={loading}
        color="white"
        indicatorSize="large"
        messageFontSize={24}
        message="Loading..."
      />

      <NotificationPopup
        style={{ backgroundColor: "red" }}
        ref={popup}
        renderPopupContent={renderCustomPopup}
        shouldChildHandleResponderStart={true}
        shouldChildHandleResponderMove={true}
      />
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

  subContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#030067",
    padding: 20,
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
    height: 150,
    borderRadius: 10,
    width: "100%",
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
