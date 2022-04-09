import React, { useEffect, useState } from "react";
import { Button, Dimensions, StyleSheet, View } from "react-native";
import {
	interpolate,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { AnimatedCard, CARDS, CARD_WIDTH } from "../components/Card";

const cardList = [CARDS.CARD1, CARDS.CARD2, CARDS.CARD3];

const { width } = Dimensions.get("window");

export const Transition: React.FC = () => {
	const [toggle, setToggle] = useState(false);
	const isToggle = useSharedValue(0);
	useEffect(() => {
		isToggle.value = toggle ? 1 : 0;
	}, [toggle]);
	const transition = useDerivedValue(() => withSpring(isToggle.value));
	return (
		<>
			<View style={{ flex: 1 }}>
				{cardList.map((uri, index) => {
					const animatedStyles = useAnimatedStyle(() => {
						const rotate = interpolate(
							transition.value,
							[0, 1],
							[0, ((index - 1) * Math.PI) / 6]
						);
						return {
							transform: [
								{ translateX: -CARD_WIDTH / 2 },
								{ rotate: `${rotate} rad` },
								{ translateX: CARD_WIDTH / 2 },
							],
						};
					});
					return (
						<View key={index} style={styles.card}>
							<AnimatedCard
								key={index}
								containerStyle={animatedStyles}
								source={{ uri }}
							/>
						</View>
					);
				})}
			</View>
			<Button
				title={toggle ? "reset" : "toggle"}
				onPress={() => setToggle((_value) => !_value)}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	card: {
		position: "absolute",
		top: width / 2,
		left: 24,
	},
});
