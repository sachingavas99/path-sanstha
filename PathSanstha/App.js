import React, { useRef } from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./components/Login";
import OptionsSelection from "./components/OptionsSelection";
import TransferWithinBank from "./components/TransferWithinBank";
import TransferOutsideBank from "./components/TransferOutsideBank";
import Balance from "./components/Balance";
import Ledger from "./components/Ledger";
import BeneficieryList from "./components/BeneficieryList";
import AddBenificiery from "./components/AddBenificiery";
import MyAccounts from "./components/MyAccounts";
import DrawerContent from "./components/DrawerContent";
import Button from "./components/Button";
import DrawerHeader from "./components/DrawerHeader";
import UpdatePassword from "./components/UpdatePassword";

import { Provider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import { theme } from "./core/theme";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { ToastProvider } from "react-native-paper-toast";
import configureStore from "./store/store";
import Drawer from "react-native-drawer";

const store = configureStore();

const Stack = createStackNavigator();

function App() {
  let drawer = useRef(null);
  let navigateReference = useRef(null);

  const closeControlPanel = () => {
    drawer.current.close();
  };
  const openControlPanel = () => {
    drawer.current.open();
  };

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SafeAreaView style={{ flex: 1 }}>
        <PaperProvider theme={theme}>
          <Provider store={store}>
            <ToastProvider>
              <Drawer
                ref={drawer}
                content={
                  <DrawerContent
                    closeDrawer={closeControlPanel}
                    navigate={navigateReference}
                  />
                }
                style={styles.drawerStyles}
                openDrawerOffset={100}
              >
                <NavigationContainer ref={navigateReference}>
                  <Stack.Navigator
                    screenOptions={{
                      header: () => (
                        // <View>
                        //   <Text>Test .............</Text>
                        // </View>
                        <DrawerHeader
                          openDrawer={openControlPanel}
                        ></DrawerHeader>
                      ),
                    }}
                    initialRouteName="Login"
                  >
                    <Stack.Screen
                      name="Login"
                      component={Login}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="OptionsSelection"
                      component={OptionsSelection}
                      options={{}}
                    />
                    <Stack.Screen
                      name="TransferWithinBank"
                      component={TransferWithinBank}
                      options={
                        {
                          // header: () => null,
                        }
                      }
                    />
                    <Stack.Screen
                      name="TransferOutsideBank"
                      component={TransferOutsideBank}
                      options={
                        {
                          // header: () => null,
                        }
                      }
                    />
                    <Stack.Screen
                      name="Balance"
                      component={Balance}
                      options={
                        {
                          // header: () => null,
                        }
                      }
                    />
                    <Stack.Screen
                      name="Ledger"
                      component={Ledger}
                      options={
                        {
                          // header: () => null,
                        }
                      }
                    />
                    <Stack.Screen
                      name="BeneficieryList"
                      component={BeneficieryList}
                      options={
                        {
                          // header: () => null,
                        }
                      }
                    />
                    <Stack.Screen
                      name="AddBenificiery"
                      component={AddBenificiery}
                      options={
                        {
                          // header: () => null,
                        }
                      }
                    />
                    <Stack.Screen
                      name="MyAccounts"
                      component={MyAccounts}
                      options={
                        {
                          // header: () => null,
                        }
                      }
                    />
                    <Stack.Screen
                      name="UpdatePassword"
                      component={UpdatePassword}
                      options={
                        {
                          // header: () => null,
                        }
                      }
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </Drawer>
            </ToastProvider>
          </Provider>
        </PaperProvider>
      </SafeAreaView>
    </SafeAreaProvider>
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
  drawerStyles: {},
});

export default App;
