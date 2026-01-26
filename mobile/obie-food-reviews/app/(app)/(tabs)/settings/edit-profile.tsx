import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Alert, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from "react-native";
import { supabase } from "@/lib/supabase.client";
import { useRouter, useNavigation } from "expo-router";
import { API_BASE_URL } from '@/config/api';

async function editUserName(params: { newUsername: string }) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

	if (sessionError || !session?.access_token) {
		throw sessionError;
	}

    const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`

        },
        body: JSON.stringify({
            display_name: params.newUsername,
        }),
    })

    if (!response.ok) {
		const text = await response.text();
		throw new Error(`${response.status} ${response.statusText}: ${text}`);
	}

	return response.json();
}

async function getCurrentProfile() {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
        console.error('Session error:', sessionError);
        throw new Error('No session found');
    }
    
    const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
        },
    });

    if (!response.ok) {
        const text = await response.text();
        console.error('Profile fetch error:', text);
        throw new Error(`${response.status} ${response.statusText}: ${text}`);
    } 

    const data = await response.json();
    return data;
}

export default function EditProfile() {
    const [newUsername, setNewUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const navigation = useNavigation();

    const handleSave = async() => {
        if (saving) return;

        setSaving(true);

        try {
            await editUserName({ newUsername });
            if (Platform.OS === 'web') {
                window.alert("Profile updated successfully");
            } else {
                Alert.alert("Success", "Profile updated successfully");
            }
            router.back();
        } catch (error: any) {
            if (Platform.OS === 'web') {
                window.alert(`Error: ${error?.message ?? "Failed to update profile"}`);
            } else {
                Alert.alert("Error", error?.message ?? "Failed to update profile");
            }
        } finally {
            setSaving(false);
        }
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={handleSave} disabled={saving} className="mr-4">
                    <Text className="text-[#A6192E] font-bold text-xl">
                        Save
                    </Text>
                </Pressable>
            ),
        });
    }, [navigation, handleSave, saving]);

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await getCurrentProfile();
                setNewUsername(data.profile.display_name);
            } catch (error: any) {
                console.error('Load profile error:', error);
                const errorMsg = error?.message ?? "Failed to load profile";
                if (Platform.OS === 'web') {
                    window.alert(`Error: ${errorMsg}`);
                } else {
                    Alert.alert("Error", errorMsg);
                }
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#A6192E"/>
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback 
            onPress={Keyboard.dismiss}
            disabled={Platform.OS === 'web'}
        >
            <View className="flex-1 w-[90%] self-center mt-4 gap-2">
                <Text className="text-md text-gray-600 font-bold">Username</Text>
                <TextInput 
                    className="border bg-white rounded-lg border-gray-300 px-3 py-3" 
                    placeholder="Enter new username" value={newUsername} 
                    onChangeText={setNewUsername}
                    editable={!saving}
                />
            </View>
        </TouchableWithoutFeedback>
    )
}