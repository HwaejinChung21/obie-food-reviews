import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'react-native';

export default function TabLayout() {
    const capitalizeFirst = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const router = useRouter();

    return (
        <Tabs
            screenOptions={{ 
                headerShown: true,
                header: ({ route }) => {
                    const isFeed = route.name === "feed";

                    return (
                        <View className="flex-row items-end justify-between px-6 pb-3 border-b border-gray-300 bg-white" style={{height: 120}}>
                            <View style={{ width: 30 }} />
                            {isFeed ? (
                                <View className="flex-1 justify-center items-center">
                                    <Image
                                        source={require('../../../assets/images/obie-food-reviews-maroon-on-white-transparent.png')}
                                        style={{ width: 150, height: 50 }}
                                        resizeMode="contain"
                                    />
                                </View>
                            ) : (
                                <View className="flex-1 justify-center items-center">
                                    <Text className="text-black font-bold text-2xl">{capitalizeFirst(route.name)}</Text>
                                </View>                        
                            )}
                            {isFeed ? (
                                <Pressable
                                    onPress={() => router.push("/add-review")}
                                >
                                      {({ pressed }) => (
                                        
                                        <Ionicons name="add-circle" size={30} color="#A6192E" style={{ opacity: pressed ? 0.5 : 1 }} />
                                        
                                        )}
                                </Pressable>
                            ): (
                                <View style={{ width: 30 }} />
                            )}
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