import { cva, type VariantProps } from "class-variance-authority";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  View,
} from "react-native";

import { haptics } from "@/lib/haptics";
import { brandColor } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "flex-row items-center justify-center active:opacity-80",
  {
    variants: {
      variant: {
        primary: "bg-brand-500",
        secondary:
          "border border-brand-200 bg-brand-50 dark:border-brand-700 dark:bg-brand-950",
        outline: "border border-outline-strong bg-transparent",
        ghost: "bg-transparent",
        destructive: "bg-danger",
      },
      size: {
        sm: "h-10 px-4",
        md: "h-12 px-5",
        lg: "h-14 px-6",
      },
      fullWidth: {
        true: "w-full",
        false: "self-start",
      },
      disabled: {
        true: "opacity-40",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
      disabled: false,
    },
  },
);

const buttonContentVariants = cva("flex-row items-center", {
  variants: {
    size: {
      sm: "gap-1.5",
      md: "gap-2",
      lg: "gap-2.5",
    },
    loading: {
      // Invisible but still laid out, so the button keeps its width
      // while the absolutely-positioned spinner shows.
      true: "opacity-0",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    loading: false,
  },
});

export const buttonTextVariants = cva("font-sans", {
  variants: {
    variant: {
      primary: "text-white",
      secondary: "text-brand-600 dark:text-brand-300",
      outline: "text-foreground",
      ghost: "text-foreground",
      destructive: "text-white",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type Props = Omit<PressableProps, "disabled"> &
  VariantProps<typeof buttonVariants> & {
    label: string;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
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
  ...props
}: Props) {
  const isDisabled = disabled || loading;

  const loaderColor =
    variant === "primary" || variant === "destructive" ? "white" : brandColor;

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
        {leftIcon}
        <Text className={buttonTextVariants({ variant, size })}>{label}</Text>
        {rightIcon}
      </View>
      {loading && (
        <ActivityIndicator
          size="small"
          color={loaderColor}
          className="absolute"
        />
      )}
    </Pressable>
  );
}
