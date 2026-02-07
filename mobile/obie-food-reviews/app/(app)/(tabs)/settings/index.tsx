import { View, Text, Button, Pressable, SectionList, Linking } from 'react-native'
import React from 'react'
import { supabase } from '@/lib/supabase.client'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Href, useRouter } from 'expo-router'

type SettingsItem = {
    id: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    type: string;
    to: string;
}
/**
 * Main settings screen with navigation to account settings.
 * Includes sign-out functionality.
 */
export default function SettingsIndex() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    async function handleSignOut() {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            setLoading(false);
        }
    }

    const settingsSections = [
        {
            id: "account",
            title: "Account Settings",
            data: [
                {
                    id: "edit-profile",
                    label: "Edit Profile",
                    icon: "person-outline",
                    type: "link",
                    to: "/settings/edit-profile",
                },
                {
                    id: "change-password",
                    label: "Change Password",
                    icon: "lock-closed-outline",
                    type: "link",
                    to: "/(auth)/reset-password",
                },
                {
                    id:"my-reviews",
                    label: "My Reviews",
                    icon: "document-text-outline",
                    type: "link",
                    to: "/settings/my-reviews",
                }
            ] as SettingsItem[]
        }
    ]

    return (
        <SafeAreaView className="flex-1" edges={['bottom']}>
            <View className="w-[90%] flex-1 self-center mt-2 ">

                <SectionList
                    sections={settingsSections}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingVertical: 0, marginVertical: 0}}
                    stickySectionHeadersEnabled={false}
                    scrollEnabled={false}
                    renderSectionHeader={({section: {title}}) => (
                        <Text className="text-md text-gray-600 font-bold py-2">{title}</Text>
                    )}
                    renderItem={({item, index, section}) => {
                        const isFirst = index === 0;
                        const isLast = index === section.data.length - 1;

                        return (
                            <View className={`bg-white ${isFirst ? 'rounded-t-xl' : ''} ${isLast ? 'rounded-b-xl mb-6' : ''} w-full self-center overflow-hidden`}>
                                <Pressable 
                                    className="flex-row items-center justify-between px-4 py-4"
                                    onPress={() => router.push(item.to as Href)}
                                >
                                    <View className="flex-row items-center">
                                        <Ionicons name={item.icon} size={24} color="#A6192E" />
                                        <Text className="text-md font-medium ml-2">{item.label}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                                </Pressable>
                                {!isLast && <View className="h-[1px] bg-gray-200 ml-4 mr-4"/>}
                            </View>
                        )
                    }}
                />
            </View>
            
            <Pressable
                onPress={()=> Linking.openURL('https://forms.gle/PAJ6GCEBLkc5LJ8P7')}
                className="flex-row items-center bg-[#A6192E] w-[200px] justify-center py-3 mb-4 self-center rounded-xl gap-2"
            >
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="white" />
                <Text className="text-white text-center text-lg font-bold">Leave Feedback</Text>
            </Pressable>

            <Pressable 
                disabled={loading}
                onPress={handleSignOut}
                className={`bg-[#A6192E] w-[150px] pt-2 pb-2 mb-4 self-center rounded-xl ${loading ? 'opacity-50' : ''}`}
            >
                <Text className="text-white text-center text-lg py-2 font-bold">
                    {loading ? 'Signing out...' : 'Sign out'}
                </Text>
            </Pressable>
        </SafeAreaView>
    )
}

