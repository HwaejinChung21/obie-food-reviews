import { View, Text, Alert, Image, TextInput, Pressable, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router';
import React, { useState } from 'react'
import { supabase } from '../../lib/supabase.client';
import { Ionicons } from '@expo/vector-icons';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password })

      if (error) {
        Alert.alert(error.message)
        return
      }

      const userEmail = data.user?.email;

      if (!userEmail?.endsWith('@oberlin.edu')) {
        Alert.alert('Please use your ObieID email to sign in.')
        await supabase.auth.signOut()
      }
    } finally {
      setLoading(false)
    }
  }

  async function signUpWithEmail() {
    setLoading(true)

    try {
      if (!email.endsWith('@oberlin.edu')) {
        Alert.alert('Error', 'Please use your @oberlin.edu email address')

        return
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({ email: email, password: password })

      if (error) {
        Alert.alert(error.message)
      }

      if (!session) {
        Alert.alert('Please check your email for the confirmation link!') 
      } 

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
              <Text className="text-[#fff7e4] font-medium underline"> Sign up</Text>
            </Pressable>
          </View>
          <View className="bg-white rounded-xl mb-4 p-4 w-5/6 self-center">
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
            <Pressable className="flex-row justify-center">
              <Text className="text-[#fff7e4] font-medium underline">Forgot Your Password?</Text>
            </Pressable>
          </View>
          <View className="mt-4 mb-6">
            <Pressable 
              disabled={loading} 
              onPress={() => signInWithEmail()}
              className="bg-[#fff7e4] w-5/6 pt-2 pb-2 self-center rounded-xl"
            >
              <Text className="text-[#A6192E] text-center text-lg py-2 font-medium">Sign in with ObieID</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
