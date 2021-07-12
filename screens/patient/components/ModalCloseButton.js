import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import styled from 'styled-components'

const Container = styled.View({
	alignItems: 'flex-end',
})

const ModalCloseButton = ({ onClose }) => {
	return (
		<Container>
			<Ionicons name='close' size={20} color='black' onPress={onClose} />
		</Container>
	)
}

export default ModalCloseButton
