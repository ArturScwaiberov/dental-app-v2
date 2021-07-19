import { Ionicons } from '@expo/vector-icons'
import * as dateFns from 'date-fns'
import { Button, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native'
import Modal from 'react-native-modal'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { patientsApi, proceduresApi } from '../../../utils'
import ConfirmDialog from './ConfirmDialog'
import InvoicePaymentForm from './InvoicePaymentForm'
import Loader from './Loader'
import Spacer from './Spacer'

const Line1 = styled.Text({
	fontSize: 18,
})

const Line2 = styled.Text({
	color: '#737373',
})

const ListItem = ({ item, createdBy, onCancel }) => {
	const { amount, type, createdAt } = item
	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				paddingVertical: 8,
			}}
		>
			<View style={{ flex: 3.3 }}>
				<Line1>
					{dateFns.formatDistanceToNowStrict(new Date(createdAt), {
						addSuffix: true,
					})}
				</Line1>
				<Line2>{createdBy}</Line2>
			</View>
			<View style={{ flex: 2 }}>
				<Line1>${amount}</Line1>
				<Line2>{type}</Line2>
			</View>
			<View style={{ flex: 2 }}>
				<Line1>-</Line1>
				<Line2>Remained</Line2>
			</View>
			<View style={{ flex: 0.7 }}>
				<Ionicons
					name='trash-outline'
					size={24}
					color='black'
					onPress={onCancel}
				/>
			</View>
		</View>
	)
}

const MemoizedListItem = React.memo(ListItem)

const PaymentsTab = ({ invoice, onAddPayment, onUpdate }) => {
	const [loading, setLoading] = useState(true)
	const [payments, setPayments] = useState([])

	const [isAddPayment, setIsAddPayment] = useState(false)
	const showAddPayment = () => setIsAddPayment(true)
	const hideAddPayment = () => setIsAddPayment(false)

	const [payment, setPayment] = useState(false)
	const showConfirmDialog = (payment) => () => setPayment(payment)
	const hideConfirmDialog = () => setPayment(null)

	const token = useSelector((state) => state.auth.token)
	const patient = useSelector((state) => state.patients.currentPatient)
	const common = useSelector((state) => state.common)

	const fetchPayments = async () => {
		setLoading(true)
		const { data } = await proceduresApi.getInvoicePayments(
			token,
			patient.id,
			invoice.id,
		)
		setPayments(
			data
				.filter((d) => !d.isCanceled)
				.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
		)
		setLoading(false)
	}

	useEffect(() => {
		fetchPayments()
	}, [])

	const renderItem = ({ item }) => (
		<MemoizedListItem
			item={item}
			createdBy={
				common.users.find((user) => user.id === item.createdCustomerId)
					?.fullName
			}
			onCancel={showConfirmDialog(item)}
		/>
	)

	const renderSeparator = () => (
		<View
			style={{
				borderBottomColor: 'lightgray',
				borderBottomWidth: 1,
			}}
		/>
	)

	const confirmPaymentCancellation = async () => {
		setLoading(true)
		hideConfirmDialog()
		await patientsApi.cancelPayment(
			token,
			patient.id,
			invoice.id,
			payment.id,
			{
				...payment,
				isCanceled: true,
			},
		)
		await onUpdate()
	}

	const payRemained = invoice
		? (invoice.totalAmount - invoice.paidAmount).toString()
		: 0

	return (
		<View style={{ padding: 16, flex: 1 }}>
			<Button full onPress={showAddPayment}>
				<Text>+ Add Payment</Text>
			</Button>
			<Spacer value={12} />

			<Loader loading={loading} />
			<View style={{ flex: 1 }}>
				<FlatList
					data={payments}
					keyExtractor={(item) => item.id}
					renderItem={renderItem}
					ItemSeparatorComponent={renderSeparator}
				/>
			</View>
			<Modal isVisible={isAddPayment} onBackdropPress={hideAddPayment}>
				<InvoicePaymentForm
					onClose={hideAddPayment}
					onAddPayment={onAddPayment}
					payRemained={payRemained}
				/>
			</Modal>

			<Modal isVisible={!!payment} onBackdropPress={hideConfirmDialog}>
				<ConfirmDialog
					onClose={hideConfirmDialog}
					onConfirmation={confirmPaymentCancellation}
				/>
			</Modal>
		</View>
	)
}

export default PaymentsTab
