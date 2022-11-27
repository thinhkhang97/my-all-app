import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

type Props = {};



export const GestureBar: React.FC<Props> = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
      <Text>Hello world</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
contentContainer: {

}
});
