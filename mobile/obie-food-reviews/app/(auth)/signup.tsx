import { View, Text, Alert, Image, TextInput, Pressable, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '../../lib/supabase.client';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    async function signUpWithEmail() {
        setLoading(true)
    
        try {
            if (!email.endsWith('@oberlin.edu')) {
                if (Platform.OS === 'web') {
                    window.alert('Error: Please use your @oberlin.edu email address')
                } else {
                    Alert.alert('Error', 'Please use your @oberlin.edu email address')
                }
                return
            }

            const redirectUrl = Platform.OS === 'web' 
                ? `${window.location.origin}/login`
                : "https://obie-food-reviews.expo.app/login";
    
            const { data: { session }, error } = await supabase.auth.signUp({ email: email, password: password, options: {
                emailRedirectTo: redirectUrl
            } });
    
            if (error) {
                if (Platform.OS === 'web') {
                    window.alert(`Error: ${error.message}`)
                } else {
                    Alert.alert(`Error: ${error.message}`)
                }
            }
    
            if (!session) {
                if (Platform.OS === 'web') {
                    window.alert('Please check your email for the confirmation link! (Check spam folder too!)')
                } else {
                    Alert.alert('Please check your email for the confirmation link! (Check spam folder too!)')
                }
            } 
        
        } finally {
        setLoading(false)
        }
    }

return (
    <SafeAreaView className="flex-1 bg-[#A6192E]">
        <TouchableWithoutFeedback 
            onPress={Keyboard.dismiss}
            disabled={Platform.OS === 'web'}
        >
            <View className="flex-1 align-items-center">

                {/* Back Button */}
                <Pressable 
                    onPress={() => router.back()}
                    className="absolute top-4 left-4 z-10"
                >
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </Pressable>

                <Text className="flex self-center text-white text-3xl font-bold mt-4 mb-14">Create Account</Text>

                <View className="bg-white rounded-xl mt-4 mb-4 p-4 w-5/6 self-center">
                    {/* Email Input */}
                    <View className="flex-row items-center border-b border-gray-200 pb-4 mb-4">
                    <Ionicons name="mail-outline" size={24} color="#A6192E" />
                    <TextInput
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="flex-1 ml-3 text-gray-900"
                        placeholderTextColor="#9CA3AF"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                    />
                    </View>
        
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
                                window.alert('Error: Passwords do not match');
                            } else {
                                Alert.alert('Error', 'Passwords do not match');
                            }
                            return;
                        }
                        signUpWithEmail();
                    }}
                    className="bg-[#fff7e4] w-full pt-2 pb-2 rounded-xl"
                    >
                    {({ pressed }) => (
                        <View
                        className={`bg-[#fff7e4] rounded-xl ${pressed || loading ? "opacity-50" : "opacity-100"}`}
                        >
                            <Text className="text-[#A6192E] text-center text-lg py-2 font-medium">Sign up with ObieID</Text>
                        </View>
                    )}
                    </Pressable>
                </View>
                
            </View>
        </TouchableWithoutFeedback>
    </SafeAreaView>
)
}