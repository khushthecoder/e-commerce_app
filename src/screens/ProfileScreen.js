import React from "react";
import { View, Text, Button } from "react-native";
import { logoutUser } from "../../services/authService";

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>👤 Profile Screen</Text>
      <Button title="Logout" onPress={logoutUser} />
    </View>
  );
}
