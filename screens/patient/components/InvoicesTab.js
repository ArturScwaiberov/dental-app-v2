import {
	FontAwesome5,
	Ionicons,
	MaterialCommunityIcons,
} from '@expo/vector-icons'
import * as dateFns from 'date-fns'
import React, { useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import styled from 'styled-components'
import InvoiceDetail from './InvoiceDetail'

const Bold = styled.Text({
	color: '#000',
	fontSize: 16,
	fontWeight: 'bold',
})

const AppointmentCardRow = styled.View({
	flexDirection: 'row',
	marginBottom: 7.5,
	marginTop: 7.5,
})

const AppointmentCardLabel = styled.Text({
	color: '#000',
	fontSize: 16,
	flex: 1,
	flexWrap: 'wrap',
})

const AppointmentCard = styled.View({
	backgroundColor: '#fff',
	// borderRadius: 10,
	paddingTop: 14,
	paddingBottom: 14,
	paddingLeft: 15,
	paddingRight: 15,
	marginBottom: 20,
})

/**CHECK LATER: Make this component more lighther if FlatList is slow:*/
const ListItem = ({ item, clinicUsers, onPress }) => {
	return (
		<TouchableOpacity onPress={onPress}>
			<AppointmentCard
				style={{
					shadowColor: 'gray',
					shadowOffset: { width: 0, height: 0 },
					shadowOpacity: 0.1,
					shadowRadius: 2,
					elevation: 1,
				}}
			>
				<AppointmentCardRow>
					<FontAwesome5
						style={{ marginRight: 7 }}
						name='file-invoice-dollar'
						size={20}
						color='#A3A3A3'
					/>
					<AppointmentCardLabel>
						Invoice # <Bold>{item.internalIndex}</Bold>
					</AppointmentCardLabel>
				</AppointmentCardRow>
				<AppointmentCardRow>
					<MaterialCommunityIcons
						style={{ marginRight: 7 }}
						name='calendar-outline'
						size={20}
						color='#A3A3A3'
					/>
					<AppointmentCardLabel>
						Created at:{' '}
						<Bold>
							{dateFns.format(
								new Date(item.createdAt),
								'yyyy-MM-dd, HH:mm',
							)}
						</Bold>
					</AppointmentCardLabel>
				</AppointmentCardRow>

				<AppointmentCardRow>
					<Ionicons
						style={{ marginRight: 7 }}
						name='ios-person-circle-outline'
						size={20}
						color='#A3A3A3'
					/>
					<AppointmentCardLabel>
						Doctor:{' '}
						<Bold>
							{
								clinicUsers.find(
									(user) =>
										user.id === item.createdCustomerId,
								)?.fullName
							}
						</Bold>
					</AppointmentCardLabel>
				</AppointmentCardRow>

				<AppointmentCardRow>
					<Ionicons
						style={{ marginRight: 7 }}
						name='md-document'
						size={20}
						color='#A3A3A3'
					/>
					<AppointmentCardLabel>
						Sum: <Bold>{item.paidAmount - item.totalAmount}</Bold>
					</AppointmentCardLabel>
				</AppointmentCardRow>
			</AppointmentCard>
		</TouchableOpacity>
	)
}

const MemoizedListItem = React.memo(ListItem)

const InvoicesTab = ({ invoices, common, onUpdate }) => {
	const { users: clinicUsers } = common

	const [invoice, setInvoice] = useState()
	const showInvoice = (invoice) => () => setInvoice(invoice)
	const hideInvoice = () => setInvoice(null)

	const renderItem = ({ item }) => (
		<MemoizedListItem
			item={item}
			clinicUsers={clinicUsers}
			onPress={showInvoice(item)}
		/>
	)

	return (
		<>
			<FlatList
				data={invoices}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
			/>
			<Modal isVisible={!!invoice} onBackdropPress={hideInvoice}>
				<InvoiceDetail
					invoice={invoice}
					onClose={hideInvoice}
					onUpdate={onUpdate}
				/>
			</Modal>
		</>
	)
}

export default InvoicesTab
