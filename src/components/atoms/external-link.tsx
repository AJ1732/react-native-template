import { Href, Link } from "expo-router";
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from "expo-web-browser";
import { cssInterop } from "nativewind";
import { type ComponentProps } from "react";

import { cn } from "@/lib/utils";

// Link is not a RN primitive, so NativeWind drops className unless registered.
cssInterop(Link, { className: "style" });

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: Href & string;
};

export function ExternalLink({ href, className, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      className={cn(
        "font-sans text-base text-brand-600 underline dark:text-brand-300",
        className,
      )}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}
