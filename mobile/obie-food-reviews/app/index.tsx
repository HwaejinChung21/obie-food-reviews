import { Text, View, Button } from "react-native";
import { useState } from "react";
import "./global.css";

export default function Index() {
  const [menus, setMenus] = useState<any[] | null>(null);
  const API_BASE = "http://192.168.2.140:3000";

  const fetchMenus = async () => {
    try {
      const res = await fetch(`${API_BASE}/menus`);
      const json = await res.json();
      setMenus(json);
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="Fetch Menus" onPress={fetchMenus}></Button>
      {menus && (
        <View className="mt-10 ml-10 mr-10">
          <Text className="flex justify-center items-center">Name: {menus[0].name}</Text>
          <Text className="flex justify-center items-center">Description: {menus[0].description}</Text>
          <Text className="flex justify-center items-center">Station: {menus[0].stationName}</Text>
        </View>
      )}
    </View>
  );
}
