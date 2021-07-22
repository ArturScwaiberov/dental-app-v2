import { FontAwesome5 } from '@expo/vector-icons'
import { Text } from 'native-base'
import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import * as patientsActions from '../../../store/actions/patients'
import InvoicePaymentForm from './InvoicePaymentForm'
import Spacer from './Spacer'

const Row = styled.View({
	flexDirection: 'row',
	justifyContent: 'space-between',
})

const Cell = ({ line1, line2, onPress, disabled }) => {
	const press = () => {
		onPress && onPress()
	}

	return (
		<TouchableOpacity
			onPress={press}
			disabled={!onPress || disabled}
			style={{ flex: 1 }}
		>
			<View
				style={{
					backgroundColor: onPress ? '#56B54F' : 'white',
					borderRadius: 8,
					padding: 16,
					position: 'relative',
				}}
			>
				<Text
					style={{
						color: onPress ? 'white' : 'black',
						fontSize: 18,
						fontWeight: 'bold',
					}}
				>
					{line1}
				</Text>
				<Text style={{ color: onPress ? 'white' : '#737373' }}>
					{line2}
				</Text>
				{onPress && !disabled ? (
					<View
						style={{
							position: 'absolute',
							right: 16,
							top: 16,
							height: '100%',
							justifyContent: 'center',
						}}
					>
						<FontAwesome5
							name='arrow-right'
							size={24}
							color='white'
						/>
					</View>
				) : null}
			</View>
		</TouchableOpacity>
	)
}

const InvoiceSummary = ({ invoice, patientId, onAddPayment }) => {
	const [isAddPayment, setIsAddPayment] = useState(false)

	const token = useSelector((state) => state.auth.token)
	const dispatch = useDispatch()

	const showAddPayment = () => setIsAddPayment(true)
	const hideAddPayment = () => setIsAddPayment(false)

	const addPayment = async (data, cb) => {
		await onAddPayment(data, cb)
		await dispatch(patientsActions.getPatient(token, patientId))
	}

	const {
		subtotalAmount,
		discountPercent,
		taxPercent,
		totalAmount,
		paidAmount,
	} = invoice || {}
	const discountAmount = ((subtotalAmount * discountPercent) / 100).toFixed(2)
	const taxAmount = (
		((subtotalAmount - discountAmount) * taxPercent) /
		100
	).toFixed(2)
	const isFullyPaid = totalAmount === paidAmount

	const payRemained = invoice
		? (invoice.totalAmount - invoice.paidAmount).toString()
		: 0

	return (
		<View>
			<Row>
				<Cell
					line1={`$${discountAmount}`}
					line2={`Discount (${discountPercent}%)`}
				/>
				<Spacer value={16} />
				<Cell line1={`$${taxAmount}`} line2={`Tax (${taxPercent}%)`} />
			</Row>
			<Spacer value={16} />
			<Row>
				<Cell line1={`$${totalAmount}`} line2='Total' />
				<Spacer value={16} />
				<Cell
					line1={
						isFullyPaid
							? `$${paidAmount}`
							: `$${(totalAmount - paidAmount).toFixed(2)}`
					}
					line2={isFullyPaid ? 'Fully paid' : 'Pay remained'}
					onPress={showAddPayment}
					disabled={isFullyPaid}
				/>
			</Row>

			<Modal isVisible={isAddPayment} onBackdropPress={hideAddPayment}>
				<InvoicePaymentForm
					onClose={hideAddPayment}
					onAddPayment={addPayment}
					payRemained={payRemained}
				/>
			</Modal>
		</View>
	)
}

export default InvoiceSummary
