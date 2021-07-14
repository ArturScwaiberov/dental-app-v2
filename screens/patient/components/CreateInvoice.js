import { Button, Text } from 'native-base'
import React, { useState } from 'react'
import { FlatList, View } from 'react-native'
import Modal from 'react-native-modal'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { patientsApi } from '../../../utils'
import ChooseProcedure from './ChooseProcedure'
import ModalCloseButton from './ModalCloseButton'
import PatientDetail from './PatientDetail'
import ProcedureItem from './ProcedureItem'
import Spacer from './Spacer'

const ModalView = styled.View({
	backgroundColor: '#F4F5F8',
	flex: 1,
	borderRadius: 10,
	padding: 15,
	paddingTop: 10,
})

const CreateInvoice = ({ patient, onClose, onUpdate }) => {
	const [procedures, setProcedures] = useState([])

	const [isChooseProcedure, setIsChooseProcedure] = useState(false)
	const showChooseProcedure = () => setIsChooseProcedure(true)
	const hideChooseProcedure = () => setIsChooseProcedure(false)

	const token = useSelector((state) => state.auth.token)

	const invoiceTotal = procedures
		.reduce((a, c) => a + c.qty * c.fee, 0)
		.toFixed(2)

	const decreaseQuantity = (id) => () => {
		setProcedures(
			procedures.map((p) => {
				if (p.id === id) {
					return {
						...p,
						qty: p.qty > 1 ? p.qty - 1 : p.qty,
					}
				}
				return p
			}),
		)
	}

	const increaseQuantity = (id) => () => {
		setProcedures(
			procedures.map((p) => {
				if (p.id === id) {
					return {
						...p,
						qty: p.qty + 1,
					}
				}
				return p
			}),
		)
	}

	const deleteProcedure = (id) => () => {
		setProcedures(procedures.filter((p) => p.id !== id))
	}

	const addProcedures = (newProcedures) => {
		const repeatedProcedures = newProcedures.filter((np) =>
			procedures.some((p) => p.id === np.id),
		)

		if (!repeatedProcedures.length) {
			setProcedures([...newProcedures, ...procedures])
		} else {
			const nonRepeatedProcedures = newProcedures.filter(
				(np) => !repeatedProcedures.some((rp) => rp.id === np.id),
			)
			setProcedures([
				...nonRepeatedProcedures,
				...procedures.map((p) => {
					const found = repeatedProcedures.find(
						(rp) => rp.id === p.id,
					)
					if (found) {
						return {
							...p,
							qty: p.qty + found.qty,
						}
					}
					return p
				}),
			])
		}
	}

	const renderItem = ({ item }) => (
		<ProcedureItem
			procedure={item}
			onDecrease={decreaseQuantity(item.id)}
			onIncrease={increaseQuantity(item.id)}
			onDelete={deleteProcedure(item.id)}
		/>
	)

	const createInvoice = async () => {
		await patientsApi.createInvoice(token, patient.id, {
			code: '',
			note: '',
			discountPercent: 0.0,
			taxPercent: 0.0,
			procedures: procedures.map((p) => ({
				id: p.id,
				qty: p.qty,
				fee: p.fee,
			})),
		})
		await onUpdate()
		onClose()
	}

	return (
		<ModalView>
			<ModalCloseButton onClose={onClose} />

			<PatientDetail patient={patient} isMinimal />

			<Spacer value={16} />

			<View
				style={{
					backgroundColor: '#222528',
					marginHorizontal: -15,
					alignItems: 'center',
					justifyContent: 'center',
					height: 60,
				}}
			>
				<Text style={{ color: 'white', fontSize: 24 }}>
					Create Invoice
				</Text>
			</View>

			<FlatList
				style={{ marginVertical: 20 }}
				data={procedures}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				ListFooterComponent={() => (
					<Button transparent full onPress={showChooseProcedure}>
						<Text>+ Add Procedure</Text>
					</Button>
				)}
			/>

			<Button block success onPress={createInvoice}>
				<Text>Create Invoice - ${invoiceTotal}</Text>
			</Button>

			<Modal
				isVisible={isChooseProcedure}
				onBackdropPress={hideChooseProcedure}
			>
				<ChooseProcedure
					onClose={hideChooseProcedure}
					onAddProcedures={addProcedures}
				/>
			</Modal>
		</ModalView>
	)
}

export default CreateInvoice
