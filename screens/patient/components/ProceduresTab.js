import React, { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { proceduresApi } from '../../../utils'
import Loader from './Loader'

const ListItem = ({ item }) => {
	const { name, qty, fee } = item
	return (
		<View
			style={{
				padding: 16,
			}}
		>
			<Text style={{ fontSize: 16 }}>{name}</Text>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginTop: 10,
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: 'bold' }}>x{qty}</Text>
				<Text style={{ fontSize: 16, fontWeight: 'bold' }}>
					${(qty * fee).toFixed(2)}
				</Text>
			</View>
		</View>
	)
}

const MemoizedListItem = React.memo(ListItem)

const ProceduresTab = ({ invoice }) => {
	const [loading, setLoading] = useState(true)
	const [procedures, setProcedures] = useState([])

	const token = useSelector((state) => state.auth.token)
	const patient = useSelector((state) => state.patients.currentPatient)

	const fetchProcedures = async () => {
		setLoading(true)
		const { data } = await proceduresApi.getInvoiceProcedures(
			token,
			patient.id,
			invoice.id,
		)
		setProcedures(data)
		setLoading(false)
	}

	useEffect(() => {
		fetchProcedures()
	}, [])

	const renderItem = ({ item }) => <MemoizedListItem item={item} />

	const renderSeparator = () => (
		<View
			style={{
				borderBottomColor: 'lightgray',
				borderBottomWidth: 1,
			}}
		/>
	)

	return (
		<View style={{ padding: 16 }}>
			<Loader loading={loading} />
			<FlatList
				style={{ backgroundColor: '#d9e3ff', borderRadius: 8 }}
				data={procedures}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				ItemSeparatorComponent={renderSeparator}
			/>
		</View>
	)
}

export default ProceduresTab
