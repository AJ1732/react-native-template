import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/atoms/button";
import { ExternalLink } from "@/components/atoms/external-link";
import { Text } from "@/components/atoms/text";
import {
  setThemePreference,
  THEME_PREFERENCES,
  type ThemePreference,
  useThemePreference,
} from "@/lib/theme-preference";

const THEME_LABELS: Record<ThemePreference, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

const HomePage = () => {
  const preference = useThemePreference();

  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-canvas">
      <Text>Home Page</Text>
      <ExternalLink href={"https://ejemeniboi.com/"}>
        External Link
      </ExternalLink>

      <View className="flex-row gap-2">
        {THEME_PREFERENCES.map((option) => (
          <Button
            key={option}
            label={THEME_LABELS[option]}
            size="sm"
            variant={preference === option ? "secondary" : "ghost"}
            accessibilityState={{ selected: preference === option }}
            onPress={() => setThemePreference(option)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default HomePage;
