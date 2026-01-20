import { View, Text, Pressable, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';

type Meal = "breakfast" | "lunch" | "dinner";

type Station = {
  name: string;
  items: { id: string; name: string }[];
};

type DateOption = { label: string; value: string };

const MEAL_OPTIONS: { label: string; value: Meal }[] = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
];

const DINING_HALL_OPTIONS = [{ label: "Stevenson", value: "Stevenson" }]

function formatDate(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function buildLastNDaysOptions(n: number): DateOption[] {
    const options: DateOption[] = [];
    const today = new Date();

    for (let i = 0; i < n; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);

        options.push({
            label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            value: formatDate(d)
        });
    }

    return options;
}  

export default function AddReview() {
    const [hall, setHall] = useState<string>('');
    const [meal, setMeal] = useState<Meal | null>(null);
    const [servedDate, setServedDate] = useState<string | null>(null);
    const [stations, setStations] = useState<Station[]>([]);
    const [menuItemId, setMenuItemId] = useState<string | null>(null);
    const [rating, setRating] = useState<number | null>(null);
    const [description, setDescription] = useState<string>("");
    const [loadingMenu, setLoadingMenu] = useState<boolean>(false);
    const [posting, setPosting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isHallPickerOpen, setIsHallPickerOpen] = useState<boolean>(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
    const [servedDateOptions] = useState<DateOption[]>(() => buildLastNDaysOptions(7));

    const canFetchMenu = hall.trim().length > 0 && meal !== null && servedDate !== null;

    const fetchMenu = async() => {
        setError(null);
        setLoadingMenu(true);
        setMenuItemId(null);
        setStations([]);

        try {
            const url = `${API_BASE_URL}/menus?hall=${encodeURIComponent(hall)}&meal=${encodeURIComponent(meal!)}&date=${encodeURIComponent(servedDate!)}`; 
            const response = await fetch(url);

            if (!response.ok) {
                setLoadingMenu(false);
                throw new Error('Failed to fetch menu: ' + await response.text());
            }
        
            const data = await response.json();
            setStations(Array.isArray(data.stations) ? data.stations : []);

        } catch (error: any) {
            setError(error?.message ?? "Failed to fetch menu");
            setStations([]);

        } finally {
            setLoadingMenu(false);
        }
    }

    useEffect(() => {
        if (!canFetchMenu) return;

        fetchMenu();
    }, [hall, meal, servedDate]);
    
    return (
        <View className="flex-1">
            <Pressable 
            onPress={() => { setIsHallPickerOpen(true); console.log("Dining Hall pressed"); }}
            className="px-4 py-4 border-b border-gray-200 bg-white"
            >
                <View className="flex-row justify-between items-center">
                    <Text className="text-base font-medium text-gray-700">Dining Hall: </Text>
                    <View className="flex-row items-center space-x-2">
                        <Text className="text-base text-gray-700">{DINING_HALL_OPTIONS.find(option => option.value === hall)?.label ?? "Select..."}</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF"/>
                    </View>
                </View>
            </Pressable>
            <Pressable 
                onPress={() => { setIsDatePickerOpen(true); console.log("Date Served pressed"); }}
                className="px-4 py-4 border-b border-gray-200 bg-white"
            >
                <View className="flex-row justify-between items-center">
                    <Text className="text-base font-medium text-gray-700">Date Served: </Text>
                    <View className="flex-row items-center space-x-2">
                        <Text className="text-base text-gray-700">{servedDateOptions.find(option => option.value === servedDate)?.label ?? "Select..."}</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF"/>
                    </View>
                </View>
            </Pressable>
            <View className="flex-row overflow-hidden border-b border-gray-300 space-x-2">
               {MEAL_OPTIONS.map((option) => {
                const selected = meal === option.value;

                return (
                    <Pressable 
                        key={option.value}
                        onPress={() => setMeal(option.value)}
                        className={`flex-1 py-4 items-center ${selected ? 'bg-[#A6192E]' : 'bg-white'} `}
                    >
                        <Text className={`text-center font-medium ${selected ? 'text-white' : 'text-gray-700'}`}>
                            {option.label}
                        </Text>
                    </Pressable>
                )
               })}
            </View>
            <Modal 
                visible={isHallPickerOpen} 
                transparent 
                animationType="fade"
                onRequestClose={() => setIsHallPickerOpen(false)}
            >
                {/* dark area that closes the modal when you tap it */}
                <Pressable
                    className="flex-1 justify-end bg-black/40"
                    onPress={() => setIsHallPickerOpen(false)}
                >

                    {/* white sheet area, a pressable to stop outer press from firing*/}
                    <Pressable className="bg-white rounded-t-2xl p-4" onPress={() => {}}>
                        <Text className="text-lg font-semibold text-gray-900 mb-3">Select Dining Hall</Text>

                        {DINING_HALL_OPTIONS.map((option) => {
                            const selected = hall === option.value;

                            return (
                                <Pressable
                                    key={option.value}
                                    onPress={() => {
                                        setHall(option.value);
                                        setIsHallPickerOpen(false);
                                    }}
                                    className="py-4 flex-row items-center justify-between border-b border-gray-200"
                                >
                                    <Text className="text-base text-gray-900">{option.label}</Text>
                                    {selected ? (
                                        <Ionicons name="checkmark" size={20} color="#A6192E" />
                                    ) : null}
                                </Pressable>
                            );
                        })}
                        <Pressable
                            onPress={() => setIsHallPickerOpen(false)}
                            className="mt-3 py-4 items-center"
                        >
                            <Text className="text-base text-gray-700 font-semibold">Cancel</Text>
                        </Pressable>        
                    </Pressable>
                </Pressable>
            </Modal>
            <Modal 
                visible={isDatePickerOpen} 
                transparent 
                animationType="fade"
                onRequestClose={() => setIsDatePickerOpen(false)}
            >
                {/* dark area that closes the modal when you tap it */}
                <Pressable
                    className="flex-1 justify-end bg-black/40"
                    onPress={() => setIsDatePickerOpen(false)}
                >
                    {/* white sheet area, a pressable to stop outer press from firing*/}
                    <Pressable className="bg-white rounded-t-2xl p-4" onPress={() => {}}>
                        <Text className="text-lg font-semibold text-gray-900 mb-3">Select Date Served</Text>
                        
                        {servedDateOptions.map((option) =>  {
                            const selected = servedDate === option.value;

                            return (
                                <Pressable
                                    key={option.value}
                                    onPress={() => {
                                        setServedDate(option.value);
                                        setIsDatePickerOpen(false);
                                    }}
                                    className="py-4 flex-row items-center justify-between border-b border-gray-200"
                                >
                                    <Text className="text-base text-gray-900">{option.label}</Text>
                                    {selected ? (
                                        <Ionicons name="checkmark" size={20} color="#A6192E" />
                                    ) : null}
                                </Pressable>
                            )
                        })}
                        <Pressable
                            onPress={() => setIsDatePickerOpen(false)}
                            className="mt-3 py-4 items-center"
                        >
                            <Text className="text-base text-gray-700 font-semibold">Cancel</Text>
                        </Pressable>
                    </Pressable>
            </Pressable>
            </Modal>
        </View>
    )
}