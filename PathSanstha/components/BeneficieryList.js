import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setBenificieryList } from "../store/actions/user";
import Button from "./Button";
import { theme } from "../core/theme";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import axios from "axios";

export default function BeneficieryList(navigation) {
  const userData = useSelector((state) => state.userData);
  const [loading, setLoading] = useState(false);
  const [firstTimeLoaded, setFirstTimeLoaded] = useState(false);

  const dispatch = useDispatch();

  const onPressHandler = (screen) => {
    navigation.navigation.navigate(screen);
  };

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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
          console.log("****", arrStatement);
          dispatch(setBenificieryList({ BenificieryList: arrStatement }));
        }

        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        toaster.show({
          message: "Failed while fetching statement details..",
          duration: 2000,
          type: "error",
        });
      })
      .finally(() => {
        setFirstTimeLoaded(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBeneficieries();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.subContainer}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[0]}
      >
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <Text
            style={[
              styles.text,
              {
                fontSize: 24,
                paddingTop: 10,
                paddingBottom: 10,
              },
            ]}
          >
            Manage your Benificieries
          </Text>
        </View>

        {userData.benificieries && userData.benificieries.length ? (
          <View style={[styles.formWrapper]}>
            {userData.benificieries.map((item, index) => (
              <View
                style={[
                  styles.formDetailsRow,
                  // { flexDirection: "row", justifyContent: "space-between" },
                ]}
                key={index}
              >
                <Text
                  style={styles.formDetailsText}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  Name: {item.BENIFESARY}
                </Text>
                <Text
                  style={styles.formDetailsText}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  ACC: {item.ACCOUNT_CODE}
                </Text>
                <Text
                  style={styles.formDetailsText}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  IFSC: {item.IFSC_CODE}
                </Text>
                {/* <Icon name="delete-outline" color="red"></Icon> */}
              </View>
            ))}
          </View>
        ) : firstTimeLoaded ? (
          <View style={[styles.formWrapper]}>
            <Text
              style={[styles.formDetailsText, { color: "#fff" }]}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              No Benificiery Added yet.
            </Text>
          </View>
        ) : (
          <Text></Text>
        )}
      </ScrollView>
      <View style={styles.bottomFix}>
        <Button
          mode="contained"
          onPress={() => onPressHandler("AddBenificiery")}
          style={styles.btnAddBeniciery}
        >
          Add Benificiery
        </Button>
      </View>

      <OrientationLoadingOverlay
        visible={loading}
        color="white"
        indicatorSize="large"
        messageFontSize={24}
        message="Loading..."
      />
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
    padding: 10,
    borderRadius: 10,
  },

  bottomFix: {
    left: 0,
    bottom: 0,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  btnAddBeniciery: {
    width: 200,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
  },

  accountDetailsRow: {
    padding: 10,
  },

  formWrapper: {
    backgroundColor: "#030067",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    height: "100%",
  },

  formDetailsRow: {
    backgroundColor: "#FFF",
    height: 100,
    width: "100%",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "flex-start",
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
    color: "#08074c",
    fontWeight: "bold",
    fontSize: 28,
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
