import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';      

type ReviewCardProps = {
    displayName: string;
    diningHall: string;
    menuItemName: string;
    meal: string;
    rating: number;
    description: string | null;
    servedDate: string;
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ReviewCard({
    displayName,
    diningHall,
    menuItemName,
    meal,
    rating,
    description,
    servedDate
}: ReviewCardProps) {
    return (
        <View className="bg-white p-4 mb-4" style={{ borderRadius: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
            <View className="flex-row justify-between items-center mb-3">
                <View className="flex-1">
                    <Text style={{ fontSize: 18 }}>
                        <Text className="font-bold">{displayName}</Text> rated <Text className="font-bold">{diningHall}</Text>
                    </Text>
                </View>
                <View className="flex-row items-center bg-yellow-50 px-3 py-1 rounded-full ml-2">
                    <Ionicons name="star" size={16} color="#FCD34D" />
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{rating}</Text>
                </View>
            </View>
            
            <View className="mb-4">
                <Text style={{ fontSize: 12, color: '#6B7280'}}>{menuItemName} | {meal}</Text>
                <Text style={{ fontSize: 12, color: '#6B7280'}}>Served on {formatDate(servedDate)}</Text>
            </View>
            
            <View>
                {description ? (
                    <Text style={{ fontSize: 14, color: '#000000'}}>{description}</Text>
                ) : (
                    <Text style={{ fontSize: 14, color: '#000000'}}>No description provided.</Text>
                )}
            </View>
        </View>
    )
}