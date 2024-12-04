import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Explore = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>To be written here soon...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: "#e8f9fd",
  },
  text: {
    fontSize: 30, // Large font size
    fontWeight: "bold", // Bold text
    color: "#6200ea", // Primary theme color
    textAlign: "center",
    textShadowColor: "#aaa", // Subtle shadow
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  }
})

export default Explore
