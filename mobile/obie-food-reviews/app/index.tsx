import { Text, View, Button } from "react-native";
import { useState } from "react";

export default function Index() {
  const [response, setResponse] = useState<string>('Not called');
  const API_BASE = "http://192.168.2.140:3000";

  const pingApi = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      const json = await res.json();
      setResponse(JSON.stringify(json));
    } catch (err) {
      setResponse('Error calling API');
    }
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="Ping API" onPress={pingApi}></Button>
      <Text>{response}</Text>
    </View>
  );
}
