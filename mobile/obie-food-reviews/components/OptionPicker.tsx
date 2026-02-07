import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Option = { label: string; value: string };

/**
 * A pressable row that displays a label and selected value.
 * Opens a picker modal when tapped.
 */
export default function OptionPicker(props: {
    label: string;
    value: string;
    options: Option[];
    onOpen: () => void;
}) {
    const { label, value, options, onOpen } = props;
    const valueLabel = options.find((option) => option.value === value)?.label ?? "Select...";

    return (
        <Pressable 
        onPress={onOpen}
        className="px-4 py-4 border-b border-gray-200 bg-white"
        >
            <View className="flex-row justify-between items-center">
                <Text className="text-base font-medium text-gray-700">{label}: </Text>
                <View className="flex-row items-center space-x-2">
                    <Text className="text-base text-gray-700">{valueLabel}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF"/>
                </View>
            </View>
        </Pressable>
    )
}