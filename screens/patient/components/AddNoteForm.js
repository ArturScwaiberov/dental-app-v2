import { Button, Item, Text, Textarea } from 'native-base'
import React, { useState } from 'react'
import styled from 'styled-components'
import ModalCloseButton from './ModalCloseButton'

const ButtonsWrapper = styled.View({
	flex: 1,
	marginTop: 20,
})

const ModalView = styled.View({
	flex: 1,
	backgroundColor: 'white',
	borderRadius: 10,
	padding: 15,
})

const AddNoteForm = ({ onCreate, onClose }) => {
	const [note, setNote] = useState()

	const createNote = () => onCreate(note)

	return (
		<ModalView>
			<ModalCloseButton onClose={onClose} />
			<Item style={{ marginBottom: 10 }}>
				<Textarea
					onChangeText={setNote}
					value={note}
					autoFocus
					placeholder='Type note here..'
					placeholderTextColor='#ccc'
					style={{
						fontSize: 16,
						paddingVertical: 10,
						fontFamily: 'Roboto',
						color: '#222',
						flex: 1,
					}}
					bordered
					rowSpan={5}
				/>
			</Item>
			<ButtonsWrapper>
				<Button
					full
					block
					success
					onPress={createNote}
					disabled={!note}
				>
					<Text>Create note</Text>
				</Button>
			</ButtonsWrapper>
		</ModalView>
	)
}

export default AddNoteForm
