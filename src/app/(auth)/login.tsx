import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import { signIn } from "@/lib/auth";

const LoginPage = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-canvas">
      <Text>Login Page</Text>
      <Button onPress={signIn} label="Sign In" className="self-center" />
    </SafeAreaView>
  );
};

export default LoginPage;
