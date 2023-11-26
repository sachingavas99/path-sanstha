import React, { Component } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import Login from "./components/Login";
import OptionsSelection from "./components/OptionsSelection";
import Transfer from "./components/Transfer";
import Balance from "./components/Balance";
import Ledger from "./components/Ledger";
import { registerRootComponent } from "expo"; // import it explicitly

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: () => null,
        }}
        initialRouteName="Login"
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="OptionsSelection"
          component={OptionsSelection}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="Transfer"
          component={Transfer}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="Balance"
          component={Balance}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="Ledger"
          component={Ledger}
          options={{
            header: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    margin: 10,
  },
});

export default registerRootComponent(App);
