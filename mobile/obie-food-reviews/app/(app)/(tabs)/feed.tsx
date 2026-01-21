import { View, Text, ActivityIndicator, FlatList, Button } from 'react-native'
import { useState, useEffect } from 'react'
import React from 'react'
import { API_BASE_URL } from '../../../config/api';
import ReviewCard from '../../../components/ReviewCard';

export default function Feed() {

    const [reviews, setReviews ] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`${API_BASE_URL}/reviews`);

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`${response.status} ${response.statusText}: ${text}`);
                }

                const data = await response.json();
                setReviews(data);
            } catch (err: any) {
                setError(err?.message ?? 'Unknown error');
            } finally {
                setLoading(false);
            }
        }
        fetchReviews();
    }, [])

    if (loading) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#A6192E" />
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
        <View className="flex-1">
            <View className="p-3 flex-1">
                <FlatList
                    data={reviews}
                    keyExtractor={(item, index) => item.reviewUpdatedAt + index}
                    renderItem={({ item }) => (
                        <ReviewCard
                            displayName={item.displayName}
                            diningHall={item.diningHall}
                            menuItemName={item.menuItemName}
                            meal={item.meal}
                            rating={item.rating}
                            description={item.description}
                        />
                    )}
                    ItemSeparatorComponent={() => <View className="h-3" />}
                    showsVerticalScrollIndicator={false}
                    />
            </View>
        </View>
    )
}
