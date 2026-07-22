import { ScrollView as RNScrollView, ScrollViewProps } from "react-native";

export function ScrollView(props: ScrollViewProps) {
  return (
    <RNScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...props}
    />
  );
}
