import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { connect } from "react-redux";
class CounterApp extends React.Component {
  increaseCounter = () => {
    this.setState({ counter: this.state.counter + 1 });
  };
  decreaseCounter = () => {
    this.setState({ counter: this.state.counter - 1 });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: "row", width: 200 }}>
          <TouchableOpacity onPress={() => this.props.increaseCounter()}>
            <Text style={{ fontSize: 20 }}>Increase</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 20 }}>{this.props.counter}</Text>
        <View style={{ flexDirection: "row", width: 200 }}>
          <TouchableOpacity onPress={() => this.props.decreaseCounter()}>
            <Text style={{ fontSize: 20 }}>Decrease</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    counter: state.counter,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    increaseCounter: () => dispatch({ type: "INCREASE_COUNTER" }),
    decreaseCounter: () => dispatch({ type: "DECREASE_COUNTER" }),
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CounterApp);
