import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { supabase } from "@/lib/supabase.client";
import { View, ActivityIndicator } from "react-native";
import "./global.css"
import { Redirect } from "expo-router";

export default function RootLayout() {
  const [checked, setChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    // Check session once
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
      setChecked(true);
    });

    // Listen for changes
    const { data } = supabase.auth.onAuthStateChange(( event, session) => {
      setHasSession(!!session);
      setChecked(true);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (!checked) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
      <>
        <Stack screenOptions={{ headerShown: false }}>
          {/* We keep these defined so the routes exist */}
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>

        {/* The "Enforcer": This pushes the user if they are in the wrong spot */}
        {!hasSession ? (
          <Redirect href="/(auth)/login" />
        ) : (
          // Only redirect to feed if we are at the very root index
          <Redirect href="/(app)/feed" />
        )}
      </>
  );
}