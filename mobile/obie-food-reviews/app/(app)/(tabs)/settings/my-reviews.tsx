import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { supabase } from '@/lib/supabase.client';
import { API_BASE_URL } from '@/config/api';
import ReviewCard from '@/components/ReviewCard';
import { useFocusEffect } from 'expo-router'

async function fetchMyReviewsAPI() {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
        throw sessionError;
    }

    const response = await fetch(`${API_BASE_URL}/my-reviews`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status} ${response.statusText}: ${text}`);
    }

    return response.json();
}

export default function MyReviews() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMyReviews = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await fetchMyReviewsAPI();
            setReviews(data);
        } catch (err: any) {
            setError(err?.message ?? 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const loadInitial = async () => {
            setLoading(true);
            await fetchMyReviews();
            setLoading(false);
        }
        loadInitial();
    }, [])

    useFocusEffect(
        useCallback(() => {
            fetchMyReviews();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMyReviews();
        setRefreshing(false);
    }

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#A6192E" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-red-500 text-center">{error}</Text>
            </View>
        );
    }

    if (reviews.length === 0) {
        return (
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-gray-500 text-center">You have not submitted any reviews yet.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <View className="flex-1 p-3">
                <FlatList
                    data={reviews}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={
                        ({ item }) => <ReviewCard
                                displayName={item.displayName}
                                diningHall={item.diningHall}
                                menuItemName={item.menuItemName}
                                meal={item.meal}
                                rating={item.rating}
                                description={item.description}
                                servedDate={item.servedDate}
                                />
                    }
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#A6192E']}
                            tintColor="#A6192E"
                            />
                    }
                />
            </View>
        </View>
    );  
}