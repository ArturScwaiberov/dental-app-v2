import { Header, Icon, Input, Item, Text } from 'native-base'
import React, { useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import SvgIcon from './icons'
import ModalCloseButton from './ModalCloseButton'
import Procedures from './Procedures'

const ModalView = styled.View({
	backgroundColor: '#F4F5F8',
	flex: 1,
	borderRadius: 10,
	padding: 15,
	paddingTop: 10,
})

const Category = ({ category, onPress }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{ width: '50%', alignItems: 'center', padding: 16 }}
		>
			<SvgIcon code={category.code} />
			<Text style={{ fontSize: 22, fontWeight: 'bold' }}>
				{category.name}
			</Text>
		</TouchableOpacity>
	)
}

const ChooseProcedure = ({ onClose, onAddProcedures }) => {
	const [category, setCategory] = useState(null)

	const [searchText, setSearchText] = useState('')

	const priceCategories = useSelector((state) => state.common.priceCategories)

	const selectCategory = (category) => () => {
		setCategory(category)
	}

	const hideCategory = () => setCategory(null)

	return (
		<ModalView>
			<ModalCloseButton onClose={onClose} />

			<Header searchBar rounded style={{ backgroundColor: '#fff' }}>
				<Item style={{ borderRadius: 10 }}>
					<Icon name='ios-search' />
					<Input
						placeholder='Search...'
						value={searchText}
						onChangeText={setSearchText}
					/>
				</Item>
			</Header>

			<ScrollView>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
					{priceCategories
						.filter((c) =>
							c.name.match(new RegExp(searchText, 'i')),
						)
						.map((c, i) => (
							<Category
								key={c.code}
								category={c}
								onPress={selectCategory({
									name: c.name,
									index: i + 1,
								})}
							/>
						))}
				</View>
			</ScrollView>

			<Modal isVisible={!!category} onBackdropPress={hideCategory}>
				<Procedures
					category={category}
					onClose={hideCategory}
					onAddProcedures={onAddProcedures}
				/>
			</Modal>
		</ModalView>
	)
}

export default ChooseProcedure
