import { View, Text, Button, Pressable } from 'react-native'
import React from 'react'
import { supabase } from '@/lib/supabase.client'

const settings = () => {
    return (
        <View className="flex-1">
            <View className="flex-1 justify-end mb-8">
                <Pressable 
                    onPress={() => supabase.auth.signOut()}
                    className="bg-[#A6192E] w-1/2 pt-2 pb-2 self-center rounded-xl"
                >
                    <Text className="text-[#fff7e4] text-center text-lg py-2 font-bold">Sign out</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default settings