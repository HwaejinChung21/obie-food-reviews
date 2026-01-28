import React, { useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { supabase } from "../../lib/supabase.client";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useRouter } from "expo-router";

export default function UpdatePassword() {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  async function updatePassword() {
    if (!password || !confirmPassword) {
      if (Platform.OS === 'web') {
        window.alert("Error: Please fill in all fields");
      } else {
        Alert.alert("Error: Please fill in all fields");
      }
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      if (Platform.OS === 'web') {
        window.alert("Error: " + error.message);
      } else {
        Alert.alert("Error: " + error.message);
      }
    } else {
      if (Platform.OS === 'web') {
        window.alert("Success: Your password has been updated. Please log in with your new password.");
        await supabase.auth.signOut();
        router.replace("/(auth)/login");
      } else {
        Alert.alert("Success", "Your password has been updated. Please log in with your new password.", [
          {
            text: "OK",
            onPress: async () => {
              await supabase.auth.signOut();
              router.replace("/(auth)/login");
            },
          },
        ]);
      }
    }
  }

    return (
        <SafeAreaView className="flex-1 bg-[#A6192E]">
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                disabled={Platform.OS === "web"}
            >
                <View className="flex-1 items-center">
                {/* Back Button */}
                <Pressable
                    onPress={() => router.back()}
                    className="absolute top-4 left-4 z-10"
                >
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </Pressable>

                <Text className="flex self-center text-white text-3xl font-bold mt-4 mb-14">
                    Update Password
                </Text>

                <View className="bg-white rounded-xl mt-4 mb-4 p-4 w-5/6 self-center">

                    {/* Password Input */}
                    <View className="flex-row items-center border-b border-gray-200 pb-4 mb-4">
                        <Ionicons name="lock-closed-outline" size={24} color="#A6192E" />
                        <TextInput
                            placeholder="Password"
                            secureTextEntry={!showPassword}
                            className="flex-1 ml-3 text-gray-900"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                        />
                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                            size={24}
                            color="#9CA3AF"
                            />
                        </Pressable>
                    </View>

                    {/* Confirm Password Input */}
                    <View className="flex-row items-center">
                        <Ionicons name="lock-closed-outline" size={24} color="#A6192E" />
                        <TextInput
                            placeholder="Confirm Password"
                            secureTextEntry={!showConfirmPassword}
                            className="flex-1 ml-3 text-gray-900"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={(text) => setConfirmPassword(text)}
                            value={confirmPassword}
                        />
                        <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Ionicons
                            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                            size={24}
                            color="#9CA3AF"
                            />
                        </Pressable>
                    </View>
                </View>

                {/* Spacer to push button to bottom */}
                <View className="flex-1" />

                <View className="w-full px-8 mb-6">
                    <Pressable
                    disabled={loading}
                    onPress={() => {
                        if (password !== confirmPassword) {
                          if (Platform.OS === 'web') {
                            window.alert("Error: Passwords do not match");
                          } else {
                            Alert.alert("Error", "Passwords do not match");
                          }
                          return;
                        }
                        updatePassword();
                    }}
                    className="bg-[#fff7e4] w-full pt-2 pb-2 rounded-xl"
                    >
                        <Text className="text-[#A6192E] text-center text-lg py-2 font-medium">
                            Update Password
                        </Text>
                    </Pressable>
                </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
  );
}
