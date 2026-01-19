import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

export default function TabLayout() {
    const capitalizeFirst = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <Tabs
            screenOptions={{ 
                headerShown: true,
                header: ({ route, options }) => {
                    const title = options.headerTitle === 'string'
                        ? options.headerTitle
                        : capitalizeFirst(route.name);
                    return (
                        <View className="px-6 pt-12 pb-2 justify-end border-b border-gray-300 bg-white" style={{height: 120}}>
                            <Text className="text-black font-bold text-3xl">{title}</Text>
                        </View>
                    )
            },
                tabBarStyle: { 
        
                    borderTopWidth: 1,
                },
                tabBarActiveTintColor: '#FFC72C',
                tabBarInactiveTintColor: '#A6192E',
                tabBarShowLabel: false,

                tabBarItemStyle: {
                    paddingVertical: 8
                }
            }}
        >
            <Tabs.Screen
                name="feed"
                options={{
                    headerTitle: "Feed",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home-outline" color={color} size={28} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    headerTitle: "Settings",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings-outline" color={color} size={28} />
                    ),
                }}
            />
        </Tabs>
    )
}