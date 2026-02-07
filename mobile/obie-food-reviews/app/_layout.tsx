import React, { useState, useEffect } from "react";
import { Stack, Redirect, usePathname } from "expo-router";
import { supabase } from "@/lib/supabase.client";
import { View, ActivityIndicator, StatusBar } from "react-native";
import "./global.css"

/**
 * Root layout that manages authentication state and routing.
 * Redirects unauthenticated users to login, authenticated users to feed.
 * Handles special case for password reset flow (update-password route).
 */
export default function RootLayout() {
  const [checked, setChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check session once
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasSession(true);
      } else {
        setHasSession(false);
      }

      setChecked(true);
    });

    // Listen for changes
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setHasSession(true);
      } else {
        setHasSession(false);
      }
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

  // Allow update-password page regardless of auth state (for password reset flow)
  const isUpdatePasswordRoute = pathname === "/update-password";
  if (isUpdatePasswordRoute) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </>
    );
  }

  return (
      <>
        <StatusBar barStyle="dark-content" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>

        {!hasSession ? (
          <Redirect href="/(auth)/login" />
        ) : (
          // Only redirect to feed if we are at the very root index
          <Redirect href="/(app)/(tabs)/feed" />
        )}
      </>
  );
}