import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import { signOut } from "@/lib/auth";

const ProfilePage = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-canvas">
      <Text>Profile Page</Text>
      <Button label="Sign Out" onPress={signOut} className="self-center" />
    </SafeAreaView>
  );
};

export default ProfilePage;
