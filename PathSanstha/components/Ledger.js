import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { DataTable } from "react-native-paper";
import { Avatar } from "react-native-paper";
import { setStatement } from "../store/actions/user";
import axios from "axios";
import { useToast } from "react-native-paper-toast";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "react-native-elements";

const optionsPerPage = [2, 3, 4];
export default function Ledger(navigation) {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
  const [loading, setLoading] = useState(false);
  const toaster = useToast();
  const userData = useSelector((state) => state.userData.user);
  const statementData = useSelector((state) => state.userData.statementData);
  const dispatch = useDispatch();
  const fetchLedgerDetails = async () => {
    const data = {
      email: userData.email_id,
      type: "A",
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
          dispatch(setStatement({ statementData: arrStatement }));
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
        setLoading(false);
      });
  };

  const getRowColor = (type) => {
    return type == "CR" ? "#5fcc0c" : "#f73131";
  };

  React.useEffect(() => {
    setPage(0);
    fetchLedgerDetails();
  }, [itemsPerPage]);
  return (
    <View style={styles.container}>
      <View style={[styles.flexRow, { height: 100 }]}>
        <View style={[styles.col5, styles.imageWrapper]}>
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Avatar.Image
              size={90}
              source={require("../assets/header-image.png")}
            />
          </View>
        </View>
        <View
          style={{
            flex: 5,
            justifyContent: "flex-end",
            height: 100,
            paddingBottom: 10,
            alignItems: "flex-end",
            alignSelf: "flex-end",
          }}
        >
          <Text
            style={[
              styles.formDetailsText,
              styles.amountText,
              styles.textAlignLeft,
              { width: 160, paddingTop: 30 },
            ]}
          >
            Ledger Details
          </Text>
        </View>
      </View>
      <View style={[styles.flexRow, { height: 70 }]}>
        <View style={styles.col5}>
          {userData.address1 && (
            <Text
              style={[
                styles.formDetailsText,
                styles.grayText,
                styles.textAlignLeft,
              ]}
            >
              {userData.address1},
            </Text>
          )}
          {userData.address2 && (
            <Text
              style={[
                styles.formDetailsText,
                styles.grayText,
                styles.textAlignLeft,
              ]}
            >
              {userData.address2},
            </Text>
          )}
          {userData.address3 && (
            <Text
              style={[
                styles.formDetailsText,
                styles.grayText,
                styles.textAlignLeft,
              ]}
            >
              {userData.address3},
            </Text>
          )}
          {userData.city && (
            <Text
              style={[
                styles.formDetailsText,
                styles.grayText,
                styles.textAlignLeft,
              ]}
            >
              {userData.city},
            </Text>
          )}
          {userData.zip && (
            <Text
              style={[
                styles.formDetailsText,
                styles.grayText,
                styles.textAlignLeft,
              ]}
            >
              {userData.zip}
            </Text>
          )}
        </View>
        <View style={[styles.col5, { alignItems: "flex-end" }]}>
          <View style={{ width: 160 }}>
            <Text
              style={[
                styles.formDetailsText,
                styles.grayText,
                styles.textAlignLeft,
              ]}
            >
              Tel:
              {userData.phonemobile ? userData.phonemobile : <Text>-</Text>}
            </Text>
            <Text
              style={[
                styles.formDetailsText,
                styles.grayText,
                styles.textAlignLeft,
              ]}
            >
              Fax: 0-000-000-0000
            </Text>
            <Text
              style={[
                styles.formDetailsText,
                styles.grayText,
                styles.textAlignLeft,
              ]}
            >
              Customer ID:{" "}
              {userData.email_id ? userData.email_id : <Text>-</Text>}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.subContainer}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>
              <Text>Date</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text>Perticular</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text>Debit/Credit</Text>
            </DataTable.Title>
            {/* <DataTable.Title>
              <Text>Credit</Text>
            </DataTable.Title> */}
            {/* <DataTable.Title numeric>Balance</DataTable.Title> */}
          </DataTable.Header>

          {statementData.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell style={{ flex: 3 }}>
                <Text style={{ color: getRowColor(item.TRNTYPE) }}>
                  {item.DATE}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 3 }}>
                <Text style={{ color: getRowColor(item.TRNTYPE) }}>
                  {item.PARTICULAR}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell
                style={{
                  justifyContent: "flex-start",
                  flex: 3,
                }}
              >
                <Icon
                  name="rupee"
                  type="font-awesome"
                  size={12}
                  color={getRowColor(item.TRNTYPE)}
                ></Icon>
                <Text
                  style={{
                    color: getRowColor(item.TRNTYPE),
                    textAlign: "left",
                  }}
                >
                  {item.AMOUNT + " " + item.TRNTYPE}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={1}
            onPageChange={(page) => setPage(page)}
            label="1-1 of 1"
            optionsPerPage={optionsPerPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            showFastPagination
            optionsLabel={"Rows per page"}
          />
        </DataTable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: StatusBar.currentHeight,
    padding: 10,
  },

  flexRow: {
    flexDirection: "row",
    height: 100,
    width: "100%",
  },

  headerLeftText: {
    textAlign: "left",
  },

  imageWrapper: {
    paddingTop: 10,
    marginBottom: 0,
    height: 500,
  },

  col5: {
    flex: 5,
    width: "100%",
  },

  textAlignLeft: {
    textAlign: "left",
  },

  textAlignRight: {
    textAlign: "right",
  },

  grayText: {
    color: "#575757",
    fontSize: 12,
  },

  subContainer: {
    flex: 1,
    // flexDirection: "column",
    width: "100%",
    // backgroundColor: "#030067",
    // padding: 10,
    // borderRadius: 10,
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
    width: 100,
  },
});
