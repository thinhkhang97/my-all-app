import React from "react";
import { Dimensions, PixelRatio, StyleSheet, View } from "react-native";
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

const { width, height } = Dimensions.get("window");

const size = width - 32;
const r = PixelRatio.roundToNearestPixel(size / 2);
const x0 = r;
const y0 = r;
const strokeWidth = 40;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircleSlider: React.FC<Props> = () => {
	const alpha = useSharedValue((Math.PI * 3) / 2);
	const radius = r - strokeWidth / 2;
	const circleLength = radius * Math.PI * 2;

	const props = useAnimatedProps(() => {
		return {
			strokeDashoffset: (circleLength * alpha.value) / (Math.PI * 2),
		};
	});

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<View style={styles.content}>
				<Svg style={StyleSheet.absoluteFill}>
					<AnimatedCircle
						animatedProps={props}
						cx={x0}
						cy={y0}
						r={radius}
						strokeWidth={strokeWidth}
						stroke={"blue"}
						strokeDasharray={`${circleLength} ${circleLength}`}
					/>
				</Svg>
				<Cursor r={r - strokeWidth / 2} alpha={alpha} />
			</View>
		</View>
	);
};

type CursorProps = {
	r: number;
	alpha: Animated.SharedValue<number>;
};
export const Cursor: React.FC<CursorProps> = ({ r, alpha }) => {
	const center = { x: r, y: r };

	const onGestureEvent = useAnimatedGestureHandler({
		onStart: (_, ctx) => {
			const _translation = polar2Canvas(center, r, alpha);
			ctx.offsetX = _translation.x;
			ctx.offsetY = _translation.y;
		},
		onActive: (event, ctx) => {
			const x = ctx.offsetX + event.translationX;
			const _y = ctx.offsetY + event.translationY;
			let y = _y;
			if (x < center.x) {
				y = _y;
			} else if (alpha.value < Math.PI) {
				y = clamp(_y, 0, center.y - 0.01);
			} else {
				y = clamp(_y, center.y + 0.01, center.y + r);
			}
			alpha.value = canvas2Polar(center, {
				x,
				y,
			});
		},
	});

	const animatedStyles = useAnimatedStyle(() => {
		const translation = polar2Canvas(center, r, alpha);
		return {
			transform: [{ translateX: translation.x }, { translateY: translation.y }],
		};
	});

	return (
		<PanGestureHandler {...{ onGestureEvent }}>
			<Animated.View style={[styles.cursor, animatedStyles]} />
		</PanGestureHandler>
	);
};

const polar2Canvas = (
	center: { x: number; y: number },
	r: number,
	alpha: Animated.SharedValue<number>
) => {
	"worklet";
	return {
		x: center.x + r * Math.cos(alpha.value),
		y: center.y - r * Math.sin(alpha.value),
	};
};

const getDistance = (
	point1: { x: number; y: number },
	point2: { x: number; y: number }
) => {
	"worklet";
	const signal = point1.y - point2.y >= 0 ? 1 : -1;
	return (
		signal *
		Math.sqrt(
			Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
		)
	);
};

const canvas2Polar = (
	center: { x: number; y: number },
	point: { x: number; y: number }
) => {
	"worklet";
	const distance = getDistance(center, point);
	if (distance < 0) {
		return Math.PI + Math.acos((point.x - center.x) / distance);
	}
	return Math.acos((point.x - center.x) / distance);
};

const styles = StyleSheet.create({
	content: {
		width: 2 * r,
		height: 2 * r,
	},
	cursor: {
		width: strokeWidth,
		height: strokeWidth,
		backgroundColor: "green",
		borderRadius: strokeWidth / 2,
	},
});
