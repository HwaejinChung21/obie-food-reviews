import { View, Text, ActivityIndicator, SectionList, Button } from 'react-native'
import { useState, useEffect } from 'react'
import React from 'react'
import { API_BASE_URL } from '../../../config/api';
import { supabase } from '@/lib/supabase.client';

const Index = () => {

    const [menuData, setMenuData ] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                setLoading(true);
                setError(null);

                const date = new Date();
                const localDate = date.toLocaleDateString('sv-SE');
                
                const response = await fetch(`${API_BASE_URL}?hall=Stevenson&meal=dinner&date=1-12-2026`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setMenuData(Array.isArray(data.stations) ? data.stations : []);
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

    const sections = menuData.map((s) => ({
        title: s.name,
        data: s.items,
    }));
     
    return (
        <View className="flex-1">
            <Text>Feed Screen</Text>
            <SectionList
                sections={sections}
                contentContainerStyle={{ padding: 16 }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <Text className="text-sm m-2 pl-4">{item.name}</Text>
                    </View>
                )}
                renderSectionHeader={({ section }) => (
                    <Text className="font-bold text-xl m-2">{section.title}</Text>
                )}
            
            />
            <View className="m-12">
                <Button 
                    title="Sign Out" 
                    onPress={() => supabase.auth.signOut()} 
                />
            </View>
        </View>
  )
}

export default Index