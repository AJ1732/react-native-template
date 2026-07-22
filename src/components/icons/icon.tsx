import Svg, { SvgProps } from "react-native-svg";

import { useThemeColors } from "@/lib/theme";

export function Icon({
  color,
  size = 24,
  viewBox = "0 0 24 24",
  strokeWidth = 1.5,
  children,
  ...props
}: SvgProps & { size?: number }) {
  const colors = useThemeColors();
  return (
    <Svg
      width={size}
      height={size}
      viewBox={viewBox}
      color={color ?? colors.icon}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </Svg>
  );
}
