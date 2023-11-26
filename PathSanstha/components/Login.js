import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { setUserData } from "../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import { TextInput, Divider } from "react-native-paper";
import {
  emailValidator,
  passwordValidator,
  stringValidator,
} from "../core/util";
import Button from "./Button";
import axios from "axios";
// import request from "client-request";
import { useToast } from "react-native-paper-toast";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import { Avatar, Dialog } from "react-native-paper";
import { theme } from "../core/theme";
import { backendApi } from "../api/backendApi";

function Login(navigation) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);
  const toaster = useToast();
  const dispatch = useDispatch();

  // const callLoginApi = async () => {
  //   const data = {
  //     email: email.value,
  //     passward: password.value,
  //   };

  //   setLoading(true);
  //   axios({
  //     method: "post",
  //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     url: "http://59.97.238.86:8080/webbank.java/servlet/MobileLogin",
  //     data: data,
  //   })
  //     .then(function (response) {
  //       const body = response.data || {};
  //       if (body.message == "Success") {
  //         console.log({ ...body, ...{ email_id: email.value } });
  //         dispatch(setUserData({ ...body, ...{ email_id: email.value } }));
  //         toaster.show({
  //           message: "Logged in successfully!",
  //           duration: 2000,
  //           type: "success",
  //         });
  //         navigation.navigation.navigate("OptionsSelection");
  //       } else {
  //         toaster.show({
  //           message: "Login failed!",
  //           duration: 2000,
  //           type: "error",
  //         });
  //       }
  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       toaster.show({
  //         message: "Login failed!",
  //         duration: 2000,
  //         type: "error",
  //       });
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  const callLoginApi = async () => {
    const data = {
      email: email.value,
      passward: password.value,
    };

    const response = await backendApi.login(data);
    console.log(response);

    // setLoading(true);
    // axios({
    //   method: "post",
    //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //   url: "http://59.97.238.86:8080/webbank.java/servlet/MobileLogin",
    //   data: data,
    // })
    //   .then(function (response) {
    //     const body = response.data || {};
    //     if (body.message == "Success") {
    //       console.log({ ...body, ...{ email_id: email.value } });
    //       dispatch(setUserData({ ...body, ...{ email_id: email.value } }));
    //       toaster.show({
    //         message: "Logged in successfully!",
    //         duration: 2000,
    //         type: "success",
    //       });
    //       navigation.navigation.navigate("OptionsSelection");
    //     } else {
    //       toaster.show({
    //         message: "Login failed!",
    //         duration: 2000,
    //         type: "error",
    //       });
    //     }
    //     setLoading(false);
    //   })
    //   .catch(() => {
    //     toaster.show({
    //       message: "Login failed!",
    //       duration: 2000,
    //       type: "error",
    //     });
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };

  const _onLoginPressed = () => {
    const emailError = stringValidator(email.value);
    const passwordError = stringValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    callLoginApi();
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          marginBottom: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar.Image
          size={240}
          source={require("../assets/header-image.png")}
        />
      </View>
      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          label="Email"
          returnKeyType="next"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: "" })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          // autoCompleteType="email"
          // textContentType="emailAddress"
          // keyboardType="email-address"
          style={styles.TextInput}
          mode="outlined"
          right={<TextInput.Icon name="account" />}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          label="Password"
          returnKeyType="done"
          mode="outlined"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: "" })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
          style={styles.TextInput}
          right={<TextInput.Icon name="eye" />}
        />
      </View>

      {/* <TouchableOpacity>
        <Text style={styles.forgot_button}>Forgot Password?</Text>
      </TouchableOpacity> */}

      <Button
        mode="contained"
        onPress={_onLoginPressed}
        style={styles.loginBtn}
      >
        Login
      </Button>

      <OrientationLoadingOverlay
        visible={loading}
        color="white"
        indicatorSize="large"
        messageFontSize={24}
        message="Processing to login..."
      />

      {/* <Dialog visible={true}>
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
        <Dialog.Actions style={{ width: "100%", border: 1 }}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              height: 200,
              border: 1,
              borderColor: "red",
            }}
          >
            <View style={{ flex: 5, alignItems: "center" }}>
              <View style={{ width: 110 }}>
                <Button
                  mode="contained"
                  onPress={() => console.log("Cancel")}
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
                  onPress={() => console.log("Ok")}
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  Ok
                </Button>
              </View>
            </View>
          </View>
        </Dialog.Actions>
      </Dialog> */}
    </View>
  );
}

// const mapStateToProps = (state) => {
//   console.log(state);
//   return {
//     foods: state.foods.foodList,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     delete: (key) => dispatch(deletFood(key)),
//   };
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
    resizeMode: "contain",
  },

  inputView: {
    backgroundColor: "#FFFF",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 30,
    borderColor: "#0000",
    alignItems: "center",
  },

  TextInput: {
    // height: 50,
    // flex: 1,
    // padding: 10,
    // marginLeft: 20,
    // borderWidth: 1,
    // borderColor: "#797979",
    // marginBottom: 20,
    width: "100%",
  },

  forgot_button: {
    height: 30,
  },

  loginBtn: {
    width: "80%",
    borderRadius: 25,
    marginTop: 40,
    backgroundColor: theme.colors.primary,
  },
});

export default Login;
