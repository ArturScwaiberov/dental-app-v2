import { Button, Input, Item, Text } from 'native-base'
import React, { useState } from 'react'
import styled from 'styled-components'

const ButtonsWrapper = styled.View({
	flexDirection: 'row',
	justifyContent: 'space-between',
	marginHorizontal: 20,
})

const ModalView = styled.View({
	marginTop: '30%',
	backgroundColor: 'white',
	borderRadius: 10,
	padding: 15,
})

const AddNoteForm = ({ onCreate, onClose }) => {
	const [note, setNote] = useState()

	const createNote = () => onCreate(note)

	return (
		<ModalView>
			<Item style={{ marginBottom: 10 }}>
				<Input
					onChangeText={setNote}
					value={note}
					multiline
					numberOfLines={5}
					autoFocus
					clearButtonMode='while-editing'
					placeholder='Type note here..'
					placeholderTextColor='#ccc'
					style={{
						fontSize: 16,
						paddingVertical: 10,
						paddingLeft: 7,
						fontFamily: 'Roboto',
						color: '#222',
					}}
				/>
			</Item>
			<ButtonsWrapper>
				<Button bordered rounded onPress={onClose}>
					<Text>Cancel</Text>
				</Button>
				<Button rounded onPress={createNote} disabled={!note}>
					<Text>Create note</Text>
				</Button>
			</ButtonsWrapper>
		</ModalView>
	)
}

export default AddNoteForm
