import { useColorScheme } from "nativewind";
import { Pressable, PressableProps } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

import { brandColor, neutral } from "@/lib/colors";
import { haptics } from "@/lib/haptics";
import { cn } from "@/lib/utils";

const SPRING = { damping: 20, stiffness: 250, mass: 0.5 };

// Pill-shaped thumb; set to 1 for a circular thumb.
const THUMB_ASPECT = 1.5;

const MIN_TOUCH_TARGET = 44;

const sizes = {
  sm: { track: { width: 36, height: 20, padding: 2 }, thumb: 16 },
  md: { track: { width: 48, height: 26, padding: 3 }, thumb: 20 },
  lg: { track: { width: 60, height: 32, padding: 3 }, thumb: 26 },
} as const;

type Size = keyof typeof sizes;

type Props = Omit<PressableProps, "onPress" | "disabled"> & {
  value: boolean;
  onValueChange: (value: boolean) => void;
  size?: Size;
  disabled?: boolean;
};

export function Switch({
  value,
  onValueChange,
  size = "md",
  disabled = false,
  className,
  ...props
}: Props) {
  const { colorScheme } = useColorScheme();
  const { track, thumb } = sizes[size];
  const thumbWidth = thumb * THUMB_ASPECT;
  const travel = track.width - thumbWidth - track.padding * 2;
  // outline-strong tokens (theme.ts) — JS values needed for interpolateColor.
  const trackOffColor = colorScheme === "dark" ? neutral[600] : neutral[300];

  const progress = useDerivedValue(
    () => withSpring(value ? 1 : 0, SPRING),
    [value],
  );

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.get(),
      [0, 1],
      [trackOffColor, brandColor],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.get() * travel }],
  }));

  const hitSlop = {
    top: Math.max(0, (MIN_TOUCH_TARGET - track.height) / 2),
    bottom: Math.max(0, (MIN_TOUCH_TARGET - track.height) / 2),
    left: Math.max(0, (MIN_TOUCH_TARGET - track.width) / 2),
    right: Math.max(0, (MIN_TOUCH_TARGET - track.width) / 2),
  };

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onValueChange(!value);
      }}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: !!disabled }}
      className={cn(disabled && "opacity-40", className)}
      {...props}
    >
      {/* Animated views get style objects, not className: the css interop
          drops classes on wrapped third-party components on web. */}
      <Animated.View
        style={[
          {
            width: track.width,
            height: track.height,
            borderRadius: track.height / 2,
            padding: track.padding,
            justifyContent: "center",
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: thumbWidth,
              height: thumb,
              borderRadius: thumb / 2,
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
