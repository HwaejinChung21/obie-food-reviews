import { Stack } from "expo-router";
import { Pressable, Text } from "react-native";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: true,
          title: "Settings"
        }}
      />
      <Stack.Screen 
        name="edit-profile" 
        options={{ 
          headerShown: true,
          title: "Edit Profile",
          headerTintColor: "#A6192E",
          headerTitleStyle: {
            color: "#000000"
          },
        }}
      />
      <Stack.Screen
        name="my-reviews"
        options={{
            headerShown: true,
            title: "My Reviews",
            headerTintColor: "#A6192E",
            headerTitleStyle: {
            color: "#000000"
          },
        }}
        />
    </Stack>
  );
}