import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import styled from 'styled-components'
import { Badge } from '../../../src/components'
import EditAppointmentForm from './EditAppointmentForm'

const Bold = styled.Text({
	color: '#000',
	fontSize: 16,
	fontWeight: 'bold',
})

const ButtonsWrapper = styled.View({
	flexDirection: 'row',
	justifyContent: 'space-between',
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
	borderRadius: 10,
	paddingTop: 14,
	paddingBottom: 14,
	paddingLeft: 15,
	paddingRight: 15,
	marginBottom: 20,
})

/**CHECK LATER: Make this component more lighther if FlatList is slow:*/
const ListItem = ({ item, clinicUsers, clinicSections, onPress }) => {
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
					<MaterialCommunityIcons
						style={{ marginRight: 7 }}
						name='calendar-outline'
						size={20}
						color='#A3A3A3'
					/>
					<AppointmentCardLabel>
						Date: <Bold>{item.date}</Bold>
					</AppointmentCardLabel>
				</AppointmentCardRow>

				<AppointmentCardRow>
					<MaterialCommunityIcons
						style={{ marginRight: 7 }}
						name='calendar-clock'
						size={20}
						color='#A3A3A3'
					/>
					<AppointmentCardLabel>
						Duration:{' '}
						<Bold>
							{item.startTime.slice(0, 5)} -{' '}
							{item.endTime.slice(0, 5)}
						</Bold>
					</AppointmentCardLabel>
				</AppointmentCardRow>

				{!!item.assignedCustomerId && (
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
											user.id === item.assignedCustomerId,
									)?.fullName
								}
							</Bold>
						</AppointmentCardLabel>
					</AppointmentCardRow>
				)}

				{!!item.clinicSectionId && (
					<AppointmentCardRow>
						<Ionicons
							style={{ marginRight: 7 }}
							name='ios-enter'
							size={20}
							color='#A3A3A3'
						/>
						<AppointmentCardLabel>
							Room:{' '}
							<Bold>
								{
									clinicSections.find(
										(section) =>
											section.id === item.clinicSectionId,
									)?.name
								}
							</Bold>
						</AppointmentCardLabel>
					</AppointmentCardRow>
				)}

				{!!item.note && (
					<AppointmentCardRow>
						<Ionicons
							style={{ marginRight: 7 }}
							name='md-document'
							size={20}
							color='#A3A3A3'
						/>
						<AppointmentCardLabel>
							Note: <Bold>{item.note}</Bold>
						</AppointmentCardLabel>
					</AppointmentCardRow>
				)}

				{!!item.status && (
					<AppointmentCardRow>
						<ButtonsWrapper style={{ flex: 1 }}>
							<Badge color='green' style={{ fontWeight: 'bold' }}>
								{item.status}
							</Badge>
						</ButtonsWrapper>
					</AppointmentCardRow>
				)}
			</AppointmentCard>
		</TouchableOpacity>
	)
}

const MemoizedListItem = React.memo(ListItem)

const AppointmentsTab = ({
	patient,
	appointments,
	common,
	onUpdateAppointment,
}) => {
	const { users: clinicUsers, sections: clinicSections } = common

	const [appointmentId, setAppointmentId] = useState()

	const showAppointment = (id) => () => setAppointmentId(id)
	const hideAppointment = () => setAppointmentId(null)

	const renderItem = ({ item }) => (
		<MemoizedListItem
			item={item}
			clinicUsers={clinicUsers}
			clinicSections={clinicSections}
			onPress={showAppointment(item.id)}
		/>
	)

	const appointment = appointmentId
		? appointments.find((a) => a.id === appointmentId)
		: null

	return (
		<>
			<FlatList
				data={appointments}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
			/>
			<Modal
				isVisible={!!appointmentId}
				onBackdropPress={hideAppointment}
			>
				<EditAppointmentForm
					patient={patient}
					appointment={appointment}
					providers={clinicUsers}
					clinics={clinicSections}
					onClose={hideAppointment}
					onSave={onUpdateAppointment}
				/>
			</Modal>
		</>
	)
}

export default AppointmentsTab
