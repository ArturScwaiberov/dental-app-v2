import React from 'react'
import styled from 'styled-components/native'
import { Ionicons } from '@expo/vector-icons'

const PlusButton = ({ onPress }) => {
	return (
		<ButtonHandler
			style={{
				shadowColor: '#2A86FF',
				shadowOffset: {
					width: 0,
					height: 4,
				},
				shadowOpacity: 0.3,
				shadowRadius: 4.65,
				elevation: 8,
			}}
			onPress={onPress}
		>
			<Ionicons name='ios-add' size={32} color='white' />
		</ButtonHandler>
	)
}

const ButtonHandler = styled.TouchableOpacity({
	justifyContent: 'center',
	alignItems: 'center',
	borderRadius: '50px',
	width: '64px',
	height: '64px',
	backgroundColor: '#2A86FF',
	position: 'absolute',
	bottom: 25,
	right: 25,
})

export default PlusButton
