import { cva, type VariantProps } from "class-variance-authority";

import { brand } from "@/lib/colors";

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

export const buttonContentVariants = cva(
  "flex-row items-center justify-center",
  {
    variants: {
      size: {
        sm: "gap-1.5",
        md: "gap-2",
        lg: "gap-2.5",
      },
      loading: {
        true: "opacity-0",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      loading: false,
    },
  },
);

export const buttonTextVariants = cva("font-sans font-medium", {
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

export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;

// SVG strokes are props, not CSS, so icons and the spinner can't inherit the
// label's className color; this is the JS mirror of buttonTextVariants and must
// agree with it. The exhaustive switch forces every variant to declare a tint,
// so a new variant can't silently fall back to an invisible white-on-white.
export function buttonContentColor(
  variant: ButtonVariant,
  { foreground, isDark }: { foreground: string; isDark: boolean },
): string {
  switch (variant) {
    case "primary":
    case "destructive":
      return "#ffffff";
    case "secondary":
      return isDark ? brand[300] : brand[600];
    case "outline":
    case "ghost":
      return foreground;
  }
}
