import { Button, Text } from 'native-base'
import React from 'react'
import styled from 'styled-components'
import Spacer from './Spacer'

const ModalView = styled.View({
	backgroundColor: '#d9e3ff',
	borderRadius: 10,
	padding: 15,
})

const Row = styled.View({
	flexDirection: 'row',
	justifyContent: 'space-between',
})

const ConfirmDialog = ({ onClose, onConfirmation }) => {
	return (
		<ModalView>
			<Text
				style={{
					fontSize: 20,
					fontWeight: 'bold',
					textAlign: 'center',
				}}
			>
				Confirm
			</Text>
			<Spacer value={24} />

			<Text>This payment will be cancelled</Text>

			<Spacer value={24} />

			<Row>
				<Button block bordered onPress={onClose}>
					<Text>Cancel</Text>
				</Button>
				<Spacer value={16} />
				<Button block bordered onPress={onConfirmation}>
					<Text>Ok</Text>
				</Button>
			</Row>
			<Spacer value={16} />
		</ModalView>
	)
}

export default ConfirmDialog
