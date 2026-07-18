import * as Haptics from "expo-haptics";

// Haptics are progressive enhancement, and expo-haptics rejects on platforms
// without support (e.g. desktop web), so rejections are swallowed instead of
// surfacing as unhandled.
const fire = (action: () => Promise<unknown>) => () => {
  action().catch(() => {});
};

export const haptics = {
  light: fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  medium: fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  heavy: fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),
  success: fire(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  ),
  warning: fire(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  ),
  error: fire(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  ),
  selection: fire(() => Haptics.selectionAsync()),
};
