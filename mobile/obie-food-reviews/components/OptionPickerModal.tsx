import React from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Option = { label: string; value: string };

export default function OptionPickerModal(props: {
    visible: boolean;
    title: string;
    options: Option[];
    selectedValue: string;
    onSelect: (value: string) => void;
    onClose: () => void;
}) {
    const { visible, title, options, selectedValue, onSelect, onClose } = props;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }} onPress={onClose}>
                <Pressable 
                    className="bg-white rounded-t-2xl p-4" 
                    style={{ maxHeight: '60%' }} 
                    onPress={() => {}}>
                <Text className="text-lg font-semibold text-gray-900 mb-3">{title}</Text>

                {options.map((option) => {
                    const selected = selectedValue === option.value;

                    return (
                    <Pressable
                        key={option.value}
                        onPress={() => {
                        onSelect(option.value);
                        onClose();
                        }}
                        className="py-4 flex-row items-center justify-between border-b border-gray-200"
                    >
                        <Text className="text-base text-gray-900">{option.label}</Text>
                        {selected ? <Ionicons name="checkmark" size={20} color="#A6192E" /> : null}
                    </Pressable>
                    );
                })}

                <Pressable onPress={onClose} className="mt-3 py-4 items-center">
                    <Text className="text-base text-gray-700 font-semibold">Cancel</Text>
                </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
  );
}