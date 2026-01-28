import { View, Text, Alert, Image, TextInput, Pressable, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.client';
import { Ionicons } from '@expo/vector-icons';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { confirmed } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (confirmed && Platform.OS === 'web') {
      window.history.replaceState({}, '', '/login');
    }
  }, [confirmed]);

  async function signInWithEmail() {
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password })

      if (error) {
        if (Platform.OS === 'web') {
            window.alert(`Error: ${error.message}`)
        } else {
            Alert.alert('Error', error.message)
        }
        return
      }
        
      const userEmail = data.user?.email;

      if (!userEmail?.endsWith('@oberlin.edu')) {
        if (Platform.OS === 'web') {
            window.alert('Please use your ObieID email to sign in.')
        } else {
            Alert.alert('Please use your ObieID email to sign in.')
        }
        await supabase.auth.signOut()
        return
      }
      
      // Successful login with valid Oberlin email - navigate to feed immediately
      router.replace('/(app)/(tabs)/feed')
    } finally {
      setLoading(false)
    }
  }


  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#A6192E] justify-center"
    >
      <TouchableWithoutFeedback 
        onPress={Keyboard.dismiss}
        disabled={Platform.OS === 'web'}
      >
        <View className="flex-1 bg-[#A6192E] justify-center align-items-center">
          <Image 
            source={require('../../assets/images/logo3.png')}
            style={{ width: 250, height: 160 }}
            className="flex-row justify-center self-center mb-6"
            resizeMode="contain" 
            />
          <View className="flex-row justify-center mb-6">
            <Text className="text-white">Don't have an account?</Text>
            <Pressable onPress={() => router.push('/(auth)/signup')}>
              {({ pressed }) => (
                <Text className="text-[#fff7e4] font-medium underline" style={pressed ? { opacity: 0.5 } : {}}> Sign up</Text>
              )}
            </Pressable>
          </View>
          {confirmed === "1" && (
            <View className="bg-green-100 border border-green-300 rounded-lg px-4 py-3 mb-4 w-5/6 self-center">
              <Text className="text-green-800 text-center font-medium">
                ✅ Email confirmed. Please sign in.
              </Text>
            </View>
          )}
          <View className="bg-white rounded-xl mb-4 p-4 w-[250px] max-w-[66%] self-center">
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
            <View className="flex-row items-center">
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
          </View>
          <View className="mt-4 mb-4">
            <Pressable
              onPress={() => router.push('/(auth)/reset-password')} 
              className="flex-row justify-center"
            >
            {({ pressed }) => (
              <Text className="text-[#fff7e4] font-medium underline" style={pressed ? { opacity: 0.5 } : {}}>Forgot Your Password?</Text>
            )}
            </Pressable>
          </View>
          <View className="mt-4 mb-6">
            <Pressable 
              disabled={loading} 
              onPress={() => signInWithEmail()}
              className="bg-[#fff7e4] w-[200px] pt-2 pb-2 self-center rounded-xl"
            >
              {({ pressed }) => (
                <View
                  className={`bg-[#fff7e4] rounded-xl ${pressed || loading ? "opacity-50" : "opacity-100"}`}
                >
                  <Text className="text-[#A6192E] text-center text-lg py-2 font-medium">Sign in with ObieID</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
