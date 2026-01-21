import React from "react";
import { Modal, Pressable, View, Text, ActivityIndicator, SectionList, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Station = { name: string; items: { id: string; name: string }[] };

export default function MenuItemPickerModal(props: {
    visible: boolean;
    title: string;
    selectedValue: string | null;
    loading: boolean;
    stations: Station[];
    onSelectMenuItemId: (value: string) => void;
    onClose: () => void;
}) {
    const { visible, title, selectedValue: menuItemId, loading, stations, onSelectMenuItemId, onClose } = props;
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* dark area that closes the modal when you tap it */}
            <Pressable
                className="flex-1 justify-end"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onPress={onClose}
            >
                {/* white sheet area, a pressable to stop outer press from firing*/}
                <Pressable 
                    className="bg-white rounded-t-2xl p-4" 
                    style={{ maxHeight: '60%' }}
                    onPress={() => {}}>
                    <Text className="text-lg font-semibold text-gray-900 mb-3">{title}</Text>

                    {loading ? (
                        <ActivityIndicator size="large" color="#A6192E" />
                    ): (
                        
                        <SectionList
                            sections={stations.map(station => ({
                                title: station.name,
                                data: station.items
                            }))}
                            keyExtractor={(item) => item.id}
                            renderSectionHeader={({ section }) => (
                                <Text className="text-md font-semibold text-black mt-4 mb-4 ">
                                    {section.title}
                                </Text>
                            )}
                            renderItem={({item}) => {
                                const selected = menuItemId === item.id;
                                return (
                                    <Pressable
                                        onPress={() => {
                                            onSelectMenuItemId(item.id);
                                            onClose();
                                        }}
                                    className="flex-row items-center justify-between border-b border-gray-200 py-2"
                                >
                                    <Text className="text-base text-gray-900">{item.name}</Text>
                                    {selected ? (
                                        <Ionicons name="checkmark" size={20} color="#A6192E" />
                                    ) : null}
                                </Pressable>
                                )
                            }}
                            contentContainerStyle={{ paddingBottom: 24 }}
                            stickySectionHeadersEnabled={false}
                        />
                        )}
                    <Pressable
                        onPress={() => onClose()}
                        className="mt-3 py-4 items-center"
                    >
                        <Text className="text-base text-gray-700 font-semibold">Cancel</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    )
}