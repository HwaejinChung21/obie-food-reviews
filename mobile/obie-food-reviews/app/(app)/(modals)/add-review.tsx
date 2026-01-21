import { View, Text, Pressable, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase.client';
import OptionPickerModal from '@/components/OptionPickerModal';
import OptionPicker from '@/components/OptionPicker';
import MenuItemPickerModal from '@/components/MenuItemPickerModal';

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

const DINING_HALL_OPTIONS: { label: string; value: string }[] = [
	{ label: "Stevenson", value: "Stevenson" },
]

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

async function submitReview(params: {
	menuItemId: string;
	rating: number;
	description?: string | null;
}) {
	const { data: { session }, error: sessionError } = await supabase.auth.getSession();

	if (sessionError || !session?.access_token) {
		throw sessionError;
	}

	const response = await fetch(`${API_BASE_URL}/ratings`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${session.access_token}`
		},
		body: JSON.stringify({
			menuItemId: params.menuItemId,
			rating: params.rating,
			description: params.description ?? null
		})
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`${response.status} ${response.statusText}: ${text}`);
	}

	return response.json();
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
	const [isMenuItemPickerOpen, setIsMenuItemPickerOpen] = useState<boolean>(false);

    const [servedDateOptions] = useState<DateOption[]>(() => buildLastNDaysOptions(7));
    const canFetchMenu = hall.trim().length > 0 && meal !== null && servedDate !== null;
	const canSubmitReview = menuItemId !== null && rating !== null;
	const canPressSubmit = canSubmitReview && !posting;

	const stationItems = stations.flatMap(station => station.items);

	const menuItemOptions = stationItems.map((item) => ({
		label: item.name,
		value: item.id,
	}));

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
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <OptionPicker
				label="Dining Hall"
				options={DINING_HALL_OPTIONS}
				value={hall}
				onOpen={() => setIsHallPickerOpen(true)}
			/>
            <OptionPicker
				label="Date Served"
				options={servedDateOptions}
				value={servedDate ?? ""}
				onOpen={() => setIsDatePickerOpen(true)}
			/>
            <View className="flex-row overflow-hidden border-b border-gray-200 space-x-2">
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
			<OptionPicker
				label="Menu Item"
				options={menuItemOptions}
				value={menuItemId ?? ""}
				onOpen={() => setIsMenuItemPickerOpen(true)}
			/>
			<View className="flex-row justify-between items-center px-4 py-4 border-b border-gray-200 bg-white">
				<Text className="text-base font-medium text-gray-700 mb-2">Rating:</Text>
				<View className="flex-row space-x-2">
			   		{[1, 2, 3, 4, 5].map((star) => (
						<Pressable
							key={star}
							onPress={() => setRating(star)}
							className="px-1"
						>
							<Ionicons 
								name={rating && star <= rating ? "star" : "star-outline"}
								size={28}
								color={rating !== null && star <= rating ? "#A6192E" : "#9CA3AF"}
							/>
						</Pressable>
					))}
				</View>
			</View>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View className="px-4 py-4  bg-white">
					<Text className="text-base font-medium text-gray-700 mb-3">Description (optional):</Text>
						<TextInput
							value={description}
							onChangeText={setDescription}
							placeholder="Share your thoughts..."
							multiline
							numberOfLines={4}
							className="border border-gray-300 rounded-lg p-3 mb-3 text-base"
							placeholderTextColor="#9CA3AF"
							textAlignVertical="top"
							style={{ height: 120 }}
						/>
				</View>
			</TouchableWithoutFeedback>
			<View className="px-4 py-4 pb-12 bg-white">
				<Pressable 
					disabled={!canPressSubmit}
					onPress={async () => {
						if (!menuItemId || rating === null) return;

						try {
							setError(null);
							setPosting(true);

							await submitReview({
							menuItemId: menuItemId,
							rating: rating,
							description: description
						})
						} catch (error: any) {
							Alert.alert("Failed to submit review", error?.message ?? "Please try again");
						} finally {
							setPosting(false);
						}
					}}
					className={`w-1/2 self-center rounded-xl pt-2 pb-2 ${canPressSubmit ? "bg-[#A6192E]" : "bg-gray-300"}`}
				>
					<Text className="text-white text-center text-lg py-2 font-medium">Submit Review</Text>
				</Pressable>
			</View>
            <OptionPickerModal
				visible={isHallPickerOpen}
				title="Select Dining Hall"
				options={DINING_HALL_OPTIONS}
				selectedValue={hall}
				onSelect={(value) => setHall(value)}
				onClose={() => setIsHallPickerOpen(false)}
			/>
            <OptionPickerModal
				visible={isDatePickerOpen}
				title="Select Date Served"
				options={servedDateOptions}
				selectedValue={servedDate ?? ''}
				onSelect={(value) => setServedDate(value)}
				onClose={() => setIsDatePickerOpen(false)}
			/>
			<MenuItemPickerModal 
				visible={isMenuItemPickerOpen}
				title="Select Menu Item"
				selectedValue={menuItemId}
				loading={loadingMenu}
				stations={stations}
				onSelectMenuItemId={(value) => setMenuItemId(value)}
				onClose={() => setIsMenuItemPickerOpen(false)}
			/>
			
        </KeyboardAvoidingView>
    )
}