import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native";
import React from "react";

const Home = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/traveler.png")}
        style={{ width: 60, height: 70 }}
      />
      <Text style={styles.title}>CheckInMate</Text>
      <Text style={{ color: "#59ce8f" }}>The Ultimate Check-in App</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8f9fd",
  },
  title: {
    fontSize: 30, // Large font size
    fontWeight: "bold", // Bold text
    color: "#6200ea", // Primary theme color
    textAlign: "center",
    textShadowColor: "#aaa", // Subtle shadow
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  buttonContainer: {
    width: "80%",
    marginTop: 30,
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "row",
    borderRadius: 25,
  },
  button: {
    backgroundColor: "#6200ea",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // Adds rounded corners
    width: "60%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Adds shadow for Android
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;
