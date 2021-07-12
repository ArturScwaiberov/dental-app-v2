import { Spinner } from 'native-base'
import React from 'react'
import { View } from 'react-native'

const Loader = ({ loading }) => {
	if (!loading) {
		return null
	}

	return (
		<View style={{ justifyContent: 'center' }}>
			<Spinner color='blue' size='large' color='#2A86FF' />
		</View>
	)
}

export default Loader
