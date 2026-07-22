import { type VariantProps } from "class-variance-authority";
import { useColorScheme } from "nativewind";
import { cloneElement, isValidElement } from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  View,
} from "react-native";

import { haptics } from "@/lib/haptics";
import { useThemeColors } from "@/lib/theme";
import { cn } from "@/lib/utils";

import {
  buttonContentColor,
  buttonContentVariants,
  buttonTextVariants,
  buttonVariants,
} from "./button.styles";

export {
  buttonContentColor,
  buttonTextVariants,
  type ButtonVariant,
  buttonVariants,
} from "./button.styles";

type Props = Omit<PressableProps, "disabled"> &
  VariantProps<typeof buttonVariants> & {
    label: string;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    textClassName?: string;
  };

export function Button({
  label,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className,
  textClassName,
  ...props
}: Props) {
  const isDisabled = disabled || loading;
  const colors = useThemeColors();
  const { colorScheme } = useColorScheme();

  const tint = buttonContentColor(variant ?? "primary", {
    foreground: colors.foreground,
    isDark: colorScheme === "dark",
  });

  // Tint an icon only when the caller left color unset, so a deliberate
  // per-icon color still wins.
  const tintIcon = (icon: React.ReactNode) =>
    isValidElement<{ color?: string }>(icon) && icon.props.color === undefined
      ? cloneElement(icon, { color: tint })
      : icon;

  return (
    <Pressable
      className={cn(
        buttonVariants({ variant, size, fullWidth, disabled: isDisabled }),
        className,
      )}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...props}
      onPressIn={(e) => {
        if (variant === "destructive") haptics.heavy();
        else haptics.light();
        props.onPressIn?.(e);
      }}
    >
      <View className={buttonContentVariants({ size, loading })}>
        {tintIcon(leftIcon)}
        <Text
          className={cn(buttonTextVariants({ variant, size }), textClassName)}
        >
          {label}
        </Text>
        {tintIcon(rightIcon)}
      </View>
      {loading && (
        <ActivityIndicator size="small" color={tint} className="absolute" />
      )}
    </Pressable>
  );
}
