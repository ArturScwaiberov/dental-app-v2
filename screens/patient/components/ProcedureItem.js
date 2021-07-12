import { Ionicons } from '@expo/vector-icons'
import { Text } from 'native-base'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import QuantityPicker from './QuantityPicker'
import Spacer from './Spacer'

const ProcedureCard = styled.View({
	backgroundColor: 'white',
	borderRadius: 8,
	padding: 16,
	marginBottom: 8,
})

const ProcedureItem = ({ procedure, onIncrease, onDecrease, onDelete }) => {
	return (
		<ProcedureCard>
			<Text>
				{procedure.name}{' '}
				{procedure.status ? (
					<Text
						style={{
							textTransform: 'capitalize',
							color: '#C74A68',
						}}
					>
						{' '}
						/ {procedure.status}
					</Text>
				) : null}
			</Text>

			<Spacer value={24} />

			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingBottom: 8,
					borderBottomColor: 'lightgray',
					borderBottomWidth: 2,
				}}
			>
				<QuantityPicker
					value={procedure.qty}
					onDecrease={onDecrease}
					onIncrease={onIncrease}
				/>

				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<Text style={{ fontSize: 18, marginRight: 8 }}>
						${(procedure.qty * procedure.fee).toFixed(2)}
					</Text>
					<Ionicons
						name='trash'
						size={24}
						color='black'
						onPress={onDelete}
					/>
				</View>
			</View>
		</ProcedureCard>
	)
}

export default ProcedureItem
