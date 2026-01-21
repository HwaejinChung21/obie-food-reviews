import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "modal",
        headerTitleAlign: "center",
      }}
    >
        <Stack.Screen 
            name="add-review" 
            options={{ 
                title: "Add Review",
                headerTitleStyle: { fontWeight: "bold", fontSize: 21 },
                headerLeft: () => (
                    <Pressable 
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={26} color="#A6192E" />
                    </Pressable>
                )
            }} 
        />
    </Stack>
  );
}