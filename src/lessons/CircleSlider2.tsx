import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
	useAnimatedGestureHandler,
	useAnimatedProps,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { clamp } from "react-native-redash";
import Svg, { Circle } from "react-native-svg";

type Props = {};

interface Point {
	x: number;
	y: number;
}

const { width } = Dimensions.get("window");
const size = width / 2 - 24;
const strokeWidth = 40;
const radius = size - strokeWidth / 2;
const PI = Math.PI;

const center: Point = {
	x: size,
	y: size,
};

export const CircleSlider: React.FC<Props> = () => {
	const alpha = useSharedValue(PI / 4);
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Svg style={StyleSheet.absoluteFill}>
					<Circle
						cx={center.x}
						cy={center.y}
						r={radius}
						stroke="#C4DDFF"
						strokeWidth={strokeWidth}
					/>
					<Slider alpha={alpha} />
				</Svg>
				<Cursor circleCenter={center} alpha={alpha} radius={radius} />
			</View>
		</View>
	);
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type SliderProps = {
	alpha: Animated.SharedValue<number>;
};

const Slider: React.FC<SliderProps> = ({ alpha }) => {
	const length = 2 * PI * radius;

	const animatedProps = useAnimatedProps(() => {
		return {
			strokeDashoffset: alpha.value * radius - length,
		};
	});

	return (
		<AnimatedCircle
			animatedProps={animatedProps}
			cx={center.x}
			cy={center.y}
			r={radius}
			stroke={"#7FB5FF"}
			strokeDasharray={[length]}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
		/>
	);
};

type CursorProps = {
	circleCenter: Point;
	radius: number;
	alpha: Animated.SharedValue<number>;
};

const Cursor: React.FC<CursorProps> = ({ circleCenter, radius, alpha }) => {
	const onGestureEvent = useAnimatedGestureHandler({
		onStart: (_, context) => {
			context.offset = polar2point(circleCenter, radius, alpha.value);
		},
		onActive: (event, context) => {
			const x = event.translationX + context.offset.x;
			const _y = event.translationY + context.offset.y;
			let y = _y;
			if (x < center.x) {
				y = _y;
			} else if (alpha.value < PI) {
				y = clamp(_y, 0, center.y - 0.01);
			} else {
				y = clamp(_y, center.y + 0.01, center.y + radius);
			}
			alpha.value = point2angle(circleCenter, radius, { x, y });
		},
	});

	const animatedStyles = useAnimatedStyle(() => {
		const pos = polar2point(circleCenter, radius, alpha.value);
		return {
			transform: [
				{ translateX: pos.x - strokeWidth / 2 },
				{ translateY: pos.y - strokeWidth / 2 },
			],
		};
	});

	return (
		<PanGestureHandler onGestureEvent={onGestureEvent}>
			<Animated.View style={[styles.cursor, animatedStyles]} />
		</PanGestureHandler>
	);
};

const getDistance = (pointA: Point, pointB: Point) => {
	"worklet";
	return Math.sqrt(
		Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
	);
};

const point2angle = (circleCenter: Point, radius: number, point: Point) => {
	"worklet";
	const startPoint = {
		x: center.x + radius,
		y: center.y,
	};

	const a = getDistance(circleCenter, startPoint);
	const b = getDistance(circleCenter, point);
	const c = getDistance(point, startPoint);

	const cosOfAngle =
		(Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b);

	if (point.y <= circleCenter.y) {
		return Math.acos(cosOfAngle);
	} else {
		return 2 * PI - Math.acos(cosOfAngle);
	}
};

const polar2point = (circleCenter: Point, radius: number, alpha: number) => {
	"worklet";
	return {
		x: circleCenter.x + radius * Math.cos(alpha),
		y: circleCenter.y - radius * Math.sin(alpha),
	};
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		width: size * 2,
		height: size * 2,
	},
	cursor: {
		width: strokeWidth,
		height: strokeWidth,
		borderRadius: strokeWidth / 2,
		backgroundColor: "#001D6E",
	},
});
