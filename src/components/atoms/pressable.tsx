import { type ComponentRef, forwardRef } from "react";
import { Pressable as RNPressable, type PressableProps } from "react-native";

import { haptics } from "@/lib/haptics";
import { cn } from "@/lib/utils";

type HapticStyle = keyof typeof haptics;

type Props = PressableProps & {
  haptic?: HapticStyle | "none";
};

export const Pressable = forwardRef<ComponentRef<typeof RNPressable>, Props>(
  function Pressable(
    {
      haptic = "light",
      className,
      onPressIn,
      accessibilityRole = "button",
      ...props
    },
    ref,
  ) {
    return (
      <RNPressable
        ref={ref}
        accessibilityRole={accessibilityRole}
        className={cn("active:opacity-70", className)}
        onPressIn={(event) => {
          if (haptic !== "none") haptics[haptic]();
          onPressIn?.(event);
        }}
        {...props}
      />
    );
  },
);
