import React from "react";
import {
	Image,
	ImageSourcePropType,
	StyleSheet,
	View,
	ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

type Props = {
	source: ImageSourcePropType;
};

export const CARDS = {
	CARD1:
		"https://mir-s3-cdn-cf.behance.net/project_modules/1400/a4b33886128681.5d909dad47ded.jpg",
	CARD2: "https://img.lovepik.com/photo/40168/6245.jpg_wh860.jpg",
	CARD3:
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO40Lx8SZkAG8K0Ce9uk8WEXXiKsMWLc5ifA&usqp=CAU",
};

export const CARD_WIDTH = 300;
export const CARD_HEIGHT = 200;

export const Card: React.FC<Props> = ({ source }) => {
	return (
		<View style={styles.imageContainer}>
			<Image source={source} style={styles.image} />
		</View>
	);
};

type AnimatedCardProps = {
	containerStyle?: ViewStyle | ViewStyle[];
} & Props;

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
	source,
	containerStyle,
}) => {
	return (
		<Animated.View style={containerStyle}>
			<Card source={source} />
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	imageContainer: {},
	image: {
		width: CARD_WIDTH,
		height: CARD_HEIGHT,
		borderRadius: 16,
	},
});
