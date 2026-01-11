import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import React from 'react'

const Index = () => {

    const [menuData, setMenuData ] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('http://192.168.2.140:3000/menus');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setMenuData(data);
            } catch (err: any) {
                setError(err?.message ?? 'Unknown error');
            } finally {
                setLoading(false);
            }
        }
        fetchMenus();
    }, [])

    if (loading) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator />
        </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

     
    return (
        <View>
            <Text>Feed Screen</Text>
            {menuData && (
                <FlatList
                data={menuData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View className="p-8">
                        <Text className="font-medium">{item.name}</Text>
                        <Text className="font-medium">{item.stationName}</Text>
                    </View>
                )}
            />
            )}
        </View>
  )
}

export default Index