import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, {Circle, Path} from 'react-native-svg';
import {colors} from '../assets/colors';
import {PI, point2angle, polar2point} from '../utils/coordinate';

type Props = {};

const {width} = Dimensions.get('window');
const size = width / 2 - 24;
const strokeWidth = 40;
const radius = size - strokeWidth / 2;
const centerCircle: Point = {
  x: size,
  y: size,
};

const startAngle = PI / 2;

export const CircleSliderWithArc: React.FC<Props> = () => {
  const alpha = useSharedValue((2 * PI) / 3);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Svg style={StyleSheet.absoluteFill}>
          <Circle
            cx={centerCircle.x}
            cy={centerCircle.y}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={colors.blue1}
          />
          <ArcSlider center={centerCircle} radius={radius} alpha={alpha} />
        </Svg>
        <Cursor circleCenter={centerCircle} radius={radius} alpha={alpha} />
      </View>
    </View>
  );
};

type CursorProps = {
  circleCenter: Point;
  radius: number;
  alpha: Animated.SharedValue<number>;
};

const Cursor: React.FC<CursorProps> = ({circleCenter, radius, alpha}) => {
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.offset = polar2point(circleCenter, radius, alpha.value);
    },
    onActive: (event, context) => {
      const x = event.translationX + context.offset.x;
      const y = event.translationY + context.offset.y;
      alpha.value = point2angle(circleCenter, radius, {x, y});
    },
  });

  const animatedStyles = useAnimatedStyle(() => {
    const pos = polar2point(circleCenter, radius, alpha.value);
    return {
      transform: [
        {translateX: pos.x - strokeWidth / 2},
        {translateY: pos.y - strokeWidth / 2},
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={[styles.cursor, animatedStyles]} />
    </PanGestureHandler>
  );
};

const calculateArcPath = (
  center: Point,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  'worklet';
  const startPoint = polar2point(center, radius, startAngle);
  const endPoint = polar2point(center, radius, endAngle);
  const isLargeArc = startPoint.x < endPoint.x ? 1 : 0;

  return `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${isLargeArc} 0 ${endPoint.x} ${endPoint.y}`;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

type ArcSliderProps = {
  center: Point;
  radius: number;
  alpha: Animated.SharedValue<number>;
};

const ArcSlider: React.FC<ArcSliderProps> = ({center, radius, alpha}) => {
  const animatedProps = useAnimatedProps(() => {
    return {
      d: calculateArcPath(center, radius, startAngle, alpha.value),
    };
  });
  return (
    <AnimatedPath
      animatedProps={animatedProps}
      fill="transparent"
      strokeWidth={strokeWidth}
      stroke={colors.blue2}
      strokeLinecap="round"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: size * 2,
    height: size * 2,
  },
  cursor: {
    width: strokeWidth,
    height: strokeWidth,
    borderRadius: strokeWidth / 2,
    backgroundColor: '#001D6E',
  },
});
