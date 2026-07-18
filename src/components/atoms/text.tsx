import { cva, type VariantProps } from "class-variance-authority";
import { Text as RNText, TextProps } from "react-native";

import { cn } from "@/lib/utils";

const textVariants = cva("font-sans", {
  variants: {
    variant: {
      default: "text-foreground",
      muted: "text-foreground-muted",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

type Props = TextProps & VariantProps<typeof textVariants>;

export function Text({ className, variant, size, children, ...props }: Props) {
  return (
    <RNText
      className={cn(textVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </RNText>
  );
}
