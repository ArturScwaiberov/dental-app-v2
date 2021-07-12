import { FontAwesome5 } from '@expo/vector-icons'
import * as dateFns from 'date-fns'
import { Button, Input, Label, Radio, Text } from 'native-base'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components'
import ModalCloseButton from './ModalCloseButton'
import PatientDetail from './PatientDetail'
import Spacer from './Spacer'

const ModalView = styled.View({
	backgroundColor: 'white',
	flex: 1,
	borderRadius: 10,
	padding: 15,
	paddingTop: 10,
})

const Time = styled.Text({
	fontSize: 24,
	fontWeight: 'bold',
	color: '#2A86FF',
})

const Centered = styled.View({
	alignItems: 'center',
})

const Row = styled.View({
	flexDirection: 'row',
	justifyContent: 'space-between',
})

const LabelRow = styled.View({ flexDirection: 'row' })
const ValueRow = styled.View({
	paddingHorizontal: 35,
	paddingVertical: 10,
	borderBottomWidth: 1,
	borderColor: '#ccc',
})

const SelectOption = styled.TouchableOpacity({
	alignItems: 'center',
})
const SelectOptionLabel = styled.Text({})

const Select = ({ value, options, onChange }) => {
	const selectValue = (value) => () => onChange(value)

	return (
		<Row>
			{options.map((o) => (
				<SelectOption key={o.value} onPress={selectValue(o.value)}>
					<Radio
						selected={value === o.value}
						selectedColor={o.color}
						color='lightgray'
						onPress={selectValue(o.value)}
					/>
					<SelectOptionLabel>{o.label}</SelectOptionLabel>
				</SelectOption>
			))}
		</Row>
	)
}

const STATUS_OPTIONS = [
	{
		value: 'confirmed',
		label: 'Confirmed',
		color: '#1C3892',
	},
	{
		value: 'checkedin',
		label: 'Checked-In',
		color: '#2CB83D',
	},
	{
		value: 'noshow',
		label: 'No-show',
		color: '#B81A3D',
	},
	{
		value: 'canceled',
		label: 'Canceled',
		color: '#B81A3D',
	},
]

const EditAppointmentForm = ({
	patient,
	appointment,
	providers,
	clinics,
	onClose,
	onSave,
}) => {
	const [loading, setLoading] = useState(false)
	const [status, setStatus] = useState(appointment?.status)
	const [note, setNote] = useState(appointment?.note)
	const provider = appointment?.assignedCustomerId
		? providers.find((p) => p.id === appointment.assignedCustomerId)
				.fullName
		: null
	const room = appointment?.clinicSectionId
		? clinics.find((c) => c.id === appointment.clinicSectionId).name
		: null

	const startTime = appointment?.startTime
	const endTime = appointment?.endTime
	const date = appointment?.date

	if (!appointment) {
		return null
	}

	const save = async () => {
		setLoading(true)
		onSave(
			{
				id: appointment.id,
				patientId: patient.id,
				status,
				note,
			},
			() => {
				setLoading(false)
				onClose()
			},
		)
	}

	return (
		<ModalView>
			<ModalCloseButton onClose={onClose} />
			<ScrollView>
				<PatientDetail patient={patient} />

				<Spacer value={10} />
				<Centered>
					<Time>{`${startTime
						.split(':')
						.filter((_, i) => i < 2)
						.join(':')} - ${endTime
						.split(':')
						.filter((_, i) => i < 2)
						.join(':')}, ${dateFns.format(
						new Date(date),
						'dd MMM',
					)}`}</Time>
				</Centered>
				<Spacer value={10} />
				<Select
					value={status}
					options={STATUS_OPTIONS}
					onChange={setStatus}
				/>
				<Spacer value={20} />
				<LabelRow>
					<FontAwesome5 name='door-open' size={20} color='#ccc' />
					<Spacer value={10} />
					<Label>Room</Label>
				</LabelRow>
				<ValueRow>
					<Label>{room}</Label>
				</ValueRow>

				<Spacer value={20} />
				<LabelRow>
					<FontAwesome5 name='user-md' size={20} color='#ccc' />
					<Spacer value={10} />
					<Label>Provider</Label>
				</LabelRow>
				<ValueRow>
					<Label>{provider}</Label>
				</ValueRow>

				<Spacer value={20} />
				<LabelRow>
					<FontAwesome5 name='align-left' size={20} color='#ccc' />
					<Spacer value={10} />
					<Label>Note</Label>
				</LabelRow>
				<Input
					onChangeText={setNote}
					value={note}
					multiline
					numberOfLines={3}
					placeholder='Type note here..'
					placeholderTextColor='#ccc'
					style={{
						marginTop: 8,
						borderWidth: 1,
						borderColor: '#ccc',
						borderRadius: 5,
					}}
					disabled={loading}
				/>

				<Spacer value={20} />

				<Button rounded full onPress={save} disabled={loading}>
					<Text>Save</Text>
				</Button>
			</ScrollView>
		</ModalView>
	)
}

export default EditAppointmentForm
