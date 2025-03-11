import * as React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { cn } from "~/lib/utils";
import { Loader } from "lucide-react-native";

const Spinner = React.forwardRef<View, { className?: string; size?: number }>(
  ({ className, size }, ref) => {
    const rotation = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotate: `${rotation.value}deg` }],
      };
    });

    React.useEffect(() => {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false,
      );
    }, [rotation]);

    return (
      <Animated.View
        ref={ref}
        style={animatedStyle}
        className={cn("flex items-center justify-center", className)}
      >
        <Loader size={size} className="stroke-black" />
      </Animated.View>
    );
  },
);

Spinner.displayName = "Spinner";

export { Spinner };
