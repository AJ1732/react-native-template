import { Tabs } from "expo-router";
import { useWindowDimensions } from "react-native";

import { HomeIcon, ProfileIcon } from "@/components/icons";
import { useThemeColors } from "@/lib/theme";

export default function TabsLayout() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  // Side tab bar needs the material variant; uikit only supports bottom/top.
  const isWide = width >= 768;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "transparent" },
        tabBarPosition: isWide ? "left" : "bottom",
        tabBarVariant: isWide ? "material" : "uikit",
        tabBarLabelPosition: isWide ? "beside-icon" : undefined,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.iconMuted,
        tabBarLabelStyle: { fontFamily: "InterVariable" },
        tabBarStyle: {
          backgroundColor: colors.canvas,
          ...(isWide
            ? { borderRightColor: colors.outline }
            : { borderTopColor: colors.outline }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
