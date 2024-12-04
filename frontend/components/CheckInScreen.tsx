import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { ToastAndroid } from "react-native";

type ImageResult = {
  uri: string;
  type: string;
  name: string;
};

export default function CheckInScreen({ navigation }: { navigation: any }) {
  const [image, setImage] = useState<ImageResult | null>(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://checkinmate-i7wi.onrender.com";
 

  // Capture image using camera
  const captureImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Camera permission is required to use this feature."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImage({
        uri: result.assets[0].uri,
        type: "image/jpeg",
        name: "visitor.jpg",
      });
    }
  };

  // Function to convert image to base64
  const convertImageToBase64 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Handle check-in process
  const handleCheckIn = async () => {
    if (!image) {
      Alert.alert("Error", "Please capture an image.");
      return;
    }

    setLoading(true);
    try {
      console.log("Check-in process started");
      // Convert image to base64 string
      const base64Image = await convertImageToBase64(image.uri);

      // Send the imageBase64 to the backend for check-in
      const response = await axios.post(`${BASE_URL}/api/check-in`, {
        imageBase64: base64Image,
      });

      console.log("Backend Response:", response.data);

      if (response.data.success) {
        // Handle different success messages
        if (response.data.message.includes("already checked in")) {
          // Use this to show feedback messages
          // Alert.alert("Error", response.data.message);/
          ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
          console.log("Visitor has already checked in.");
        } else {
          ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
          console.log("Check-in process completed");
          navigation.replace("Check Out");
        }
      } else {
        // Handle case where no matching visitor is found
        Alert.alert(
          "Error",
          response.data.error || "No matching visitor found."
        );
      }
    } catch (error) {
      console.error("Check-In failed:", error);
      Alert.alert("Error", "Check-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={captureImage}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Capture Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      {loading ? (
        <View style={styles.verifyingContainer}>
          <ActivityIndicator
            size="large"
            color="#6200ea"
            style={styles.loader}
          />
          <Text style={styles.verifyingText}>Verifying Visitor...</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleCheckIn}>
          <Text style={styles.buttonText}>Check In</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  button: {
    backgroundColor: "#6200ea",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginVertical: 20,
  },
  verifyingContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  verifyingText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ea",
  },
  disabledButton: {
    backgroundColor: "#aaa", // Greyed-out color for disabled button
    shadowOpacity: 0, // Remove shadow for disabled state
    elevation: 0,
  },
});
