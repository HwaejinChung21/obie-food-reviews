import React from 'react';
import { View, Text, TouchableWithoutFeedback, Platform, Keyboard, Pressable, TextInput, Alert } from 'react-native';
import { supabase } from '../../lib/supabase.client';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useRouter } from 'expo-router';

export default function ResetPassword() {
    const [email, setEmail] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    
    async function sendResetPasswordEmail() {
        if (!email.trim()) {
            if (Platform.OS === 'web') {
                window.alert('Please enter your email address.');
            } else {
                Alert.alert('Please enter your email address.');
            }
            return;
        }

        if (!email.endsWith('@oberlin.edu')) {
            if (Platform.OS === 'web') {
                window.alert('Error: Please use your @oberlin.edu email address')
            } else {
                Alert.alert('Error', 'Please use your @oberlin.edu email address')
            }
    
            return
        }

        setLoading(true);
        
        const redirectUrl = Platform.OS === 'web' 
            ? `${window.location.origin}/update-password`
            : "https://obie-food-reviews.expo.app/update-password";
        
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl
        });

        setLoading(false);

        if (error) {
            if (Platform.OS === 'web') {
                window.alert(`Error: ${error.message}`)
            } else {
                Alert.alert('Error', error.message)
            }
        } else {
            if (Platform.OS === 'web') {
                window.alert('Success! Please check your email for the password reset link.')
            } else {
                Alert.alert('Success! Please check your email for the password reset link.')
            }
            [
                {
                    text: 'OK',
                    onPress: () => router.back()
                }
            ]
        }

    }

    return (
        <SafeAreaView className="flex-1 bg-[#A6192E]">
            <TouchableWithoutFeedback 
                onPress={Keyboard.dismiss}
                disabled={Platform.OS === 'web'}
            >
                <View className="flex-1 items-center">
                    {/* Back Button */}
                    <Pressable 
                        onPress={() => router.back()}
                        className="absolute top-4 left-4 z-10"
                    >
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </Pressable>
                    <Text className="flex self-center text-white text-3xl font-bold mt-4 mb-14">Reset Password</Text>
                    <View className="flex justify-center items-center w-5/6">
                        <Text className="flex text-center text-white text-[14px] font-medium mb-10">Enter the email associated with your account to receive a password reset link.</Text>
                    </View>
                    {/* Email Input */}
                    <View className="bg-white rounded-xl mb-4 p-4 w-5/6 self-center">
                        <View className="flex-row items-center">
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
                    </View>
                    {/* Spacer to push button to bottom */}
                    <View className="flex-1" />

                    <View className="w-full px-8 mb-6">
                        <Pressable
                            onPress={sendResetPasswordEmail}
                            className="bg-[#fff7e4] w-full pt-2 pb-2 rounded-xl"
                        >
                            <Text className="text-[#A6192E] text-center text-lg py-2 font-medium">Reset Password</Text>
                        </Pressable>
                        {/* <Pressable onPress={() => router.push('/update-password')} className="bg-[#fff7e4] w-full pt-2 pb-2 rounded-xl">
                            <Text>Test Update Password</Text>
                        </Pressable> */}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}