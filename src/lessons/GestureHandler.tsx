import React from "react";
import { Dimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withDecay,
} from "react-native-reanimated";
import { clamp, withBouncing } from "react-native-redash";
import { Card, CARDS, CARD_HEIGHT, CARD_WIDTH } from "../components/Card";

type Props = {};

const { width, height } = Dimensions.get("window");

export const GestureHandler: React.FC<Props> = () => {
	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);
	const boundX = width - CARD_WIDTH;
	const boundY = height - CARD_HEIGHT;
	const onGestureEvent = useAnimatedGestureHandler({
		onStart: (_, ctx) => {
			ctx.offsetX = translateX.value;
			ctx.offsetY = translateY.value;
		},
		onActive: (event, ctx) => {
			translateX.value = clamp(ctx.offsetX + event.translationX, 0, boundX);
			translateY.value = clamp(ctx.offsetY + event.translationY, 0, boundY);
		},
		onEnd: (event) => {
			translateX.value = withBouncing(
				withDecay({ velocity: event.velocityX }),
				0,
				boundX
			);
			translateY.value = withBouncing(
				withDecay({ velocity: event.velocityY }),
				0,
				boundY
			);
		},
	});

	const animatedStyles = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translateX.value },
			{ translateY: translateY.value },
		],
	}));

	return (
		<PanGestureHandler onGestureEvent={onGestureEvent}>
			<Animated.View style={animatedStyles}>
				<Card source={{ uri: CARDS.CARD1 }} />
			</Animated.View>
		</PanGestureHandler>
	);
};
