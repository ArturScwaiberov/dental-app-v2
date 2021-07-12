import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import * as dateFns from 'date-fns'
import React, { useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import styled from 'styled-components'

const RowBack = styled.View({
	alignItems: 'center',
	flex: 1,
	flexDirection: 'row',
	justifyContent: 'flex-end',
})

const DeleteButtonContainer = styled.View({
	backgroundColor: 'red',
	width: 60,
	height: '100%',
	marginBottom: 40,
	justifyContent: 'center',
	alignItems: 'center',
	paddingTop: 20,
})

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
const ListItem = ({ item, clinicUsers }) => {
	return (
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
								(user) => user.id === item.createdBy,
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
					Note: <Bold>{item.data}</Bold>
				</AppointmentCardLabel>
			</AppointmentCardRow>
		</AppointmentCard>
	)
}

const MemoizedListItem = React.memo(ListItem)

const NotesTab = ({ notes, common, onFetch, onDeleteNote }) => {
	const { users: clinicUsers } = common

	useEffect(() => {
		onFetch()
	}, [])

	const renderItem = ({ item }) => (
		<MemoizedListItem item={item} clinicUsers={clinicUsers} />
	)

	const deleteNote = (noteId) => () => {
		onDeleteNote(noteId)
	}

	const renderHiddenItem = (data) => (
		<RowBack>
			<DeleteButtonContainer>
				<TouchableOpacity onPress={deleteNote(data.item.id)}>
					<Ionicons name='trash-outline' size={24} color='white' />
				</TouchableOpacity>
			</DeleteButtonContainer>
		</RowBack>
	)

	return (
		<SwipeListView
			data={notes}
			renderItem={renderItem}
			renderHiddenItem={renderHiddenItem}
			rightOpenValue={-60}
			previewRowKey={'0'}
			previewOpenValue={-60}
			previewOpenDelay={2000}
			disableRightSwipe
		/>
	)
}

export default NotesTab
