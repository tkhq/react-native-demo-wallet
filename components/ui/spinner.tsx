import * as React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Icons } from '~/components/icons'; // Assuming Icons.loader is imported from here
import { cn } from '~/lib/utils';

const Spinner = React.forwardRef<View, { className?: string; size?: number }>(
  ({ className, size }, ref) => {
    // Shared value for rotation
    const rotation = useSharedValue(0);

    // Animated style for spinning
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotate: `${rotation.value}deg` }],
      };
    });

    // Start the spinning animation
    React.useEffect(() => {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
    }, [rotation]);

    return (
      <Animated.View
        ref={ref}
        style={animatedStyle}
        className={cn('flex items-center justify-center', className)}
      >
        <Icons.loader size={size} className="stroke-black" />
      </Animated.View>
    );
  }
);

Spinner.displayName = 'Spinner';

export { Spinner };
