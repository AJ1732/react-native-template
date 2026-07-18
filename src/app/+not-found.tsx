import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "@/components/atoms/text";

export default function NotFoundPage() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-canvas p-6">
      <Text size="lg">This screen does not exist.</Text>
      <Link href="/">
        <Text className="text-brand-600 underline dark:text-brand-300">
          Go to home screen
        </Text>
      </Link>
    </SafeAreaView>
  );
}
