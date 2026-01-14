import { View, Text, Alert, Button, TextInput } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '../../lib/supabase.client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 100 }}>
      <View className="m-4">
        <Text className="font-bold text-lg">Email</Text>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@oberlin.edu"
          className="border-2 border-gray-300 p-2 mt-2"
        />
      </View>
      <View className="m-4">
        <Text className="font-bold text-lg">Password</Text>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="password"
          secureTextEntry={true}
          className="border-2 border-gray-300 p-2 mt-2"
        />
      </View>
      <View className="mb-6">
        <Button title="Sign In With ObieID" disabled={loading} onPress={() => signInWithEmail()}/>
      </View>
      <View>
        <Button title="Sign Up With ObieID" disabled={loading} onPress={() => signUpWithEmail()}/>
      </View>
    </View>
  )
}
