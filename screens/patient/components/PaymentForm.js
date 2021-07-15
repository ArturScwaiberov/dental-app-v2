import { Button, Input, Item, Text } from 'native-base'
import React, { useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import { ModalPicker } from '../../../src/components'
import { patientsApi } from '../../../utils'
import ModalCloseButton from './ModalCloseButton'

const ModalView = styled.View({
	backgroundColor: 'white',
	flex: 1,
	borderRadius: 10,
	padding: 15,
})

const Block = styled.View({ marginBottom: 20 })

const Label = styled.Text({
	fontWeight: 'bold',
	fontSize: 16,
})

const ButtonsWrapper = styled.View({
	flexDirection: 'row',
	justifyContent: 'space-between',
	marginTop: 20,
})

const PaymentForm = ({ token, patient, invoiceTotal, onClose }) => {
	const { total, paid } = invoiceTotal
	const [amount, setAmount] = useState()
	const [type, setType] = useState('cash')

	const payAmount = async () => {
		await patientsApi.addPayment(token, patient.id, {
			amount,
			type,
			isPayDebts: true, //check the effect later for this.
		})

		onClose()
	}

	const withdrawAmount = async () => {
		await patientsApi.addPayment(token, patient.id, {
			amount: -1 * amount,
			type,
			isPayDebts: true, //check the effect later for this.
		})

		onClose()
	}

	return (
		<ModalView>
			<ModalCloseButton onClose={onClose} />
			<View>
				<Label>AMOUNT</Label>
				<Block>
					<Item style={{ marginBottom: 10 }}>
						<Input
							onChangeText={setAmount}
							value={amount}
							autoFocus
							placeholder='Amount..'
							placeholderTextColor='#ccc'
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
				</Block>

				<Block>
					<Label>TYPE</Label>
				</Block>

				<Block style={{ height: 50 }}>
					<ModalPicker
						header={'Payment type'}
						showTitle={'Payment type'}
						items={[
							{ id: 'cash', fullName: 'Cash' },
							{ id: 'card', fullName: 'Card' },
							{ id: 'insurance', fullName: 'Insurance' },
							{ id: 'other', fullName: 'Other' },
						]}
						selected={type}
						onSelect={setType}
					/>
				</Block>

				<ButtonsWrapper>
					{total - paid > 0 ? (
						<Button
							style={{ flex: 1, marginRight: 16 }}
							bordered
							block
							success
							onPress={withdrawAmount}
							disabled={!amount}
						>
							<Text>Withdrawal</Text>
						</Button>
					) : null}

					<Button
						style={{ flex: 1 }}
						block
						success
						onPress={payAmount}
						disabled={!amount}
					>
						<Text>
							{total - paid > 0 ? 'Pay Debts' : 'Deposit'}
						</Text>
					</Button>
				</ButtonsWrapper>
			</View>
		</ModalView>
	)
}

export default PaymentForm
