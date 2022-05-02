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

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {};
interface Point {
	x: number;
	y: number;
}

const { width } = Dimensions.get("window");
const r = width / 2 - 24;
const strokeWidth = 40;
const cursorWidth = strokeWidth;
const PI = Math.PI;

export const CircleSlider: React.FC<Props> = () => {
	const alpha = useSharedValue(PI / 3);
	const center = {
		x: r,
		y: r,
	};
	const radius = r - strokeWidth / 2;
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Svg style={StyleSheet.absoluteFill}>
					<Circle
						cx={r}
						cy={r}
						r={radius}
						strokeWidth={strokeWidth}
						stroke={"#C4DDFF"}
					/>
					<CircleProgress radius={radius} alpha={alpha} />
				</Svg>
				<Cursor center={center} alpha={alpha} radius={radius} />
			</View>
		</View>
	);
};

type CircleProgressProps = {
	radius: number;
	alpha: Animated.SharedValue<number>;
};

const CircleProgress: React.FC<CircleProgressProps> = ({ radius, alpha }) => {
	const circleLength = 2 * PI * radius;
	const props = useAnimatedProps(() => {
		const length = alpha.value * radius;
		return {
			strokeDashoffset: length - circleLength,
		};
	});
	return (
		<AnimatedCircle
			animatedProps={props}
			origin={`${r}, ${r}`}
			cx={r}
			cy={r}
			r={radius}
			strokeWidth={strokeWidth}
			stroke={"#7FB5FF"}
			strokeDasharray={[circleLength]}
			strokeLinecap="round"
		/>
	);
};

type CursorProps = {
	alpha: Animated.SharedValue<number>;
	center: Point;
	radius: number;
};

const Cursor: React.FC<CursorProps> = ({ alpha, center, radius }) => {
	const onGestureEvent = useAnimatedGestureHandler({
		onStart: (_, ctx) => {
			ctx.offset = polar2canvas(center, radius, alpha.value);
		},
		onActive: (event, ctx) => {
			const x = event.translationX + ctx.offset.x;
			const _y = event.translationY + ctx.offset.y;
			let y = _y;
			if (x < center.x) {
				y = _y;
			} else if (alpha.value < PI) {
				y = clamp(_y, 0, center.y - 0.01);
			} else {
				y = clamp(_y, center.y + 0.01, center.y + radius);
			}
			alpha.value = freePoint2Polar(center, {
				x,
				y,
			});
		},
	});

	const animatedStyles = useAnimatedStyle(() => {
		const translation = polar2canvas(center, radius, alpha.value);
		return {
			transform: [
				{ translateX: translation.x - cursorWidth / 2 },
				{ translateY: translation.y - cursorWidth / 2 },
			],
		};
	});
	return (
		<PanGestureHandler onGestureEvent={onGestureEvent}>
			<Animated.View style={[styles.cursor, animatedStyles]} />
		</PanGestureHandler>
	);
};

const polar2canvas = (center: Point, radius: number, alpha: number) => {
	"worklet";
	return {
		x: center.x + radius * Math.cos(alpha),
		y: center.y - radius * Math.sin(alpha),
	};
};

const distance = (point1: Point, point2: Point) => {
	"worklet";
	return Math.sqrt(
		Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
	);
};

const freePoint2Polar = (center: Point, point: Point) => {
	"worklet";
	const d = distance(center, point);
	if (center.y < point.y) {
		return PI + Math.acos((center.x - point.x) / d);
	}
	return Math.acos((point.x - center.x) / d);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		width: 2 * r,
		height: 2 * r,
	},
	cursor: {
		width: cursorWidth,
		height: cursorWidth,
		borderRadius: cursorWidth / 2,
		backgroundColor: "#001D6E",
	},
});
