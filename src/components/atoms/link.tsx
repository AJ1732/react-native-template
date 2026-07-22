import { cva, VariantProps } from "class-variance-authority";
import { Link as ExpoLink, LinkProps } from "expo-router";
import { cssInterop } from "nativewind";

import { cn } from "@/lib/utils";

// Link is not a RN primitive, so NativeWind drops className unless registered.
cssInterop(ExpoLink, { className: "style" });

const linkVariants = cva("font-sans", {
  variants: {
    variant: {
      default: "text-foreground",
      accent: "text-brand-500",
    },
  },
  defaultVariants: {
    variant: "accent",
  },
});

type Props = LinkProps & VariantProps<typeof linkVariants>;

export function Link({ className, variant, ...props }: Props) {
  return (
    <ExpoLink className={cn(linkVariants({ variant }), className)} {...props} />
  );
}
