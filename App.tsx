import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { GestureHandler } from "./src/lessons/GestureHandler";
import { Transition } from "./src/lessons/Transition";

export default function App() {
	const [selectedImage, setSelectedImage] = React.useState(null);

	const openImagePickerAsync = async () => {
		let permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false) {
			alert("Permission for cameraroll is required!!!");
			return;
		}
		let pickerResult = await ImagePicker.launchImageLibraryAsync();
		setSelectedImage(pickerResult);
	};

	const openShareDialogAsync = async () => {
		if (Platform.OS === "web") {
			alert(`Uh oh, sharing isn't available on your platform`);
			return;
		}

		if (!selectedImage) {
			return;
		}
		await Sharing.shareAsync(selectedImage.uri);
	};

	if (selectedImage !== null) {
		return (
			<View style={styles.container}>
				<Image source={{ uri: selectedImage.uri }} style={styles.logo} />
				<StatusBar style="auto" />
				<TouchableOpacity style={styles.button} onPress={openShareDialogAsync}>
					<Text style={styles.buttonText}>Share photo</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return <Transition />;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	logo: {
		width: 305,
		height: 159,
		marginBottom: 20,
	},
	instructions: {
		color: "#888",
		fontSize: 18,
		marginHorizontal: 15,
		marginBottom: 10,
	},
	button: {
		backgroundColor: "blue",
		padding: 20,
		borderRadius: 5,
	},
	buttonText: {
		fontSize: 20,
		color: "#fff",
	},
});
