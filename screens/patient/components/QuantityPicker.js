import { Feather } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const QuantityPicker = ({ value, onIncrease, onDecrease }) => {
	return (
		<View style={styles.container}>
			<Feather
				name='minus-circle'
				size={24}
				color='black'
				onPress={onDecrease}
			/>
			<Text style={styles.value}>{value}</Text>

			<Feather
				name='plus-circle'
				size={24}
				color='black'
				onPress={onIncrease}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	value: {
		fontSize: 20,
		paddingHorizontal: 10,
	},
})

export default QuantityPicker
