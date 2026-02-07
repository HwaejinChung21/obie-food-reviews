import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, Alert, Platform } from 'react-native';
import { supabase } from '@/lib/supabase.client';
import { API_BASE_URL } from '@/config/api';
import ReviewCard from '@/components/ReviewCard';
import { useFocusEffect } from 'expo-router'

/**
 * Fetches all reviews submitted by the authenticated user.
 * @returns Array of user's reviews
 * @throws Error if session is invalid or API request fails
 */
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

/**
 * Deletes a specific review by menu item ID.
 * @param menuItemId - The ID of the menu item to remove the rating for
 * @throws Error if session is invalid or API request fails
 */
async function deleteReviewAPI(menuItemId: string) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
        throw sessionError;
    }

    const response = await fetch(`${API_BASE_URL}/ratings/${menuItemId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${session.access_token}`
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status} ${response.statusText}: ${text}`);
    }
}

/**
 * Screen displaying all reviews submitted by the current user.
 * Supports pull-to-refresh.
 */
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

    const handleDelete = (reviewId: string, menuItemId: string) => {
        const confirmDelete = async () => {
            try {
                await deleteReviewAPI(menuItemId);
                setReviews(prev => prev.filter(r => r.id !== reviewId));
            } catch (err: any) {
                const msg = err?.message ?? 'Failed to delete review';
                if (Platform.OS === 'web') {
                    window.alert(msg);
                } else {
                    Alert.alert('Error', msg);
                }
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete this review?')) {
                confirmDelete();
            }
        } else {
            Alert.alert(
                'Delete Review',
                'Are you sure you want to delete this review?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: confirmDelete }
                ]
            );
        }
    };

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
                                onDelete={() => handleDelete(item.id, item.menuItemId)}
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