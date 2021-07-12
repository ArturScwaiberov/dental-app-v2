import { Ionicons } from '@expo/vector-icons'
import { Button, Input, Item, Radio, Text } from 'native-base'
import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'
import ModalCloseButton from './ModalCloseButton'
import Spacer from './Spacer'

const ModalView = styled.View({
	backgroundColor: '#d9e3ff',
	borderRadius: 10,
	padding: 15,
})

const Label = styled.Text({
	fontWeight: 'bold',
	fontSize: 16,
})

const Row = styled.View({
	flexDirection: 'row',
	justifyContent: 'space-between',
})

const Cell = ({ label, icon, checked, onPress }) => {
	return (
		<TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
			<View
				style={{
					backgroundColor: 'white',
					borderRadius: 8,
					padding: 8,
					alignItems: 'center',
				}}
			>
				<Ionicons name={icon} size={32} color='#1C3892' />
				<Spacer value={8} />
				<View style={{ flexDirection: 'row' }}>
					<Text style={{ color: '#737373', marginRight: 16 }}>
						{label}
					</Text>
					<Radio
						selected={checked}
						selectedColor='#1C3892'
						color='lightgray'
						onPress={onPress}
					/>
				</View>
			</View>
		</TouchableOpacity>
	)
}
//cash, card, insurance, balance
//https://cpfxbicmq4.execute-api.us-east-1.amazonaws.com/prod/v1/patients/ac449c4a-75a1-40c6-b3f7-2184b98d1ae6/invoices/a2322612-70b1-475a-83e4-6d591f569fda/payments
//amount
const InvoicePaymentForm = ({ onClose, onAddPayment }) => {
	const [amount, setAmount] = useState()
	const [type, setType] = useState('cash')

	const press = (type) => () => setType(type)

	const addInvoicePayment = () => {
		onAddPayment(
			{
				amount,
				type,
			},
			() => onClose(),
		)
	}

	return (
		<ModalView>
			<ModalCloseButton onClose={onClose} />
			<Text
				style={{
					fontSize: 20,
					fontWeight: 'bold',
					textAlign: 'center',
				}}
			>
				Add Payment
			</Text>
			<Spacer value={24} />

			<Label>1. Select a payment method</Label>
			<Spacer value={8} />
			<Row>
				<Cell
					label='Cash'
					icon='cash-outline'
					checked={type === 'cash'}
					onPress={press('cash')}
				/>
				<Spacer value={16} />
				<Cell
					label='Card'
					icon='card-outline'
					checked={type === 'card'}
					onPress={press('card')}
				/>
			</Row>
			<Spacer value={16} />
			<Row>
				<Cell
					label='Insurance'
					icon='umbrella-outline'
					checked={type === 'insurance'}
					onPress={press('insurance')}
				/>
				<Spacer value={16} />
				<Cell
					label='Balance'
					icon='wallet-outline'
					checked={type === 'balance'}
					onPress={press('balance')}
				/>
			</Row>
			<Spacer value={24} />
			<Label>2. Enter amount</Label>
			<Item
				style={{
					backgroundColor: 'white',
					marginVertical: 8,
					borderRadius: 8,
				}}
			>
				<Input
					onChangeText={setAmount}
					value={amount}
					style={{
						fontSize: 16,
						paddingVertical: 10,
						paddingLeft: 7,
						fontFamily: 'Roboto',
						color: '#222',
					}}
					keyboardType='numeric'
				/>
			</Item>
			<Spacer value={48} />
			<Button rounded full onPress={addInvoicePayment}>
				<Text>
					Add Payment - $
					{amount ? parseFloat(amount).toFixed(2) : '0.00'}
				</Text>
			</Button>
			<Spacer value={24} />
		</ModalView>
	)
}

export default InvoicePaymentForm
