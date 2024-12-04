import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  Alert,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

type ImageResult = {
  uri: string;
  type: string;
  name: string;
};

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    purpose: "",
    personVisiting: "",
  });

  const BASE_URL = "https://checkinmate-i7wi.onrender.com";
  

  const [image, setImage] = useState<ImageResult | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loader state

  // Function to capture an image from the camera
  const handleCaptureImage = async () => {
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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  // Function to handle the registration
  const handleRegister = async () => {
    const { fullName, email, phoneNumber, purpose, personVisiting } = formData;

    // Check for empty fields
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !purpose ||
      !personVisiting ||
      !image
    ) {
      Alert.alert("Error", "Please fill all fields and capture an image!");
      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address!");
      return;
    }

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number!");
      return;
    }

    setIsLoading(true); // Show loader

    try {
      // Convert image to base64 string
      const base64Image = await convertImageToBase64(image.uri);

      // Send registration data to the backend using axios
      const registrationData = {
        ...formData,
        imageBase64: base64Image, // Send base64-encoded image
      };

      console.log("Registration Started ...");
      const responseFromBackend = await axios.post(
        `${BASE_URL}/api/register`,
        registrationData, // The data to be sent in the POST request
        {
          headers: {
            "Content-Type": "application/json", // Content type header for JSON data
          },
        }
      );

      if (responseFromBackend.status === 200) {
        Alert.alert("Success", "Visitor registered successfully!");
        console.log("Registration successfull");
        navigation.replace("Check In");
      } else {
        throw new Error("Failed to register visitor.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      Alert.alert("Error", "Registration failed!");
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Visitor Registration</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        value={formData.fullName}
      />
      <TextInput
        style={[
          styles.input,
          !validateEmail(formData.email) && formData.email.length > 0
            ? { borderColor: "red" }
            : {},
        ]}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        value={formData.email}
      />

      <TextInput
        style={[
          styles.input,
          !validatePhoneNumber(formData.phoneNumber) &&
          formData.phoneNumber.length > 0
            ? { borderColor: "red" }
            : {},
        ]}
        placeholder="Phone Number"
        keyboardType="numeric"
        onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
        value={formData.phoneNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Purpose of Visit"
        onChangeText={(text) => setFormData({ ...formData, purpose: text })}
        value={formData.purpose}
      />
      <TextInput
        style={styles.input}
        placeholder="Person Visiting"
        onChangeText={(text) =>
          setFormData({ ...formData, personVisiting: text })
        }
        value={formData.personVisiting}
      />
      <TouchableOpacity
        style={[styles.captureButton, isLoading && styles.disabledButton]}
        onPress={handleCaptureImage}
      >
        <Text style={styles.captureButtonText}>Capture Image</Text>
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image.uri }} style={styles.imagePreview} />
      )}
      {isLoading ? (
        <View style={styles.registeringContainer}>
          <ActivityIndicator
            size="large"
            color="#6200ea"
            style={styles.loader}
          />
          <Text style={styles.registeringText}>Registering Visitor...</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#c2edda",
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  captureButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  captureButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 16,
    resizeMode: "cover",
  },
  registerButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginVertical: 20,
  },
  registeringContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  registeringText: {
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

export default RegisterScreen;
