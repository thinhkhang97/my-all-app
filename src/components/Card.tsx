import React from "react";
import { StyleSheet } from "react-native";
import { ImageSourcePropType } from "react-native";
import { Image, View } from "react-native";

type Props = {
	source: ImageSourcePropType;
};

export const CARDS = {
	CARD1:
		"https://mir-s3-cdn-cf.behance.net/project_modules/1400/a4b33886128681.5d909dad47ded.jpg",
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

const styles = StyleSheet.create({
	imageContainer: {},
	image: {
		width: CARD_WIDTH,
		height: CARD_HEIGHT,
		borderRadius: 16,
	},
});
