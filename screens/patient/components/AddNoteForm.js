import { Button, Item, Text, Textarea } from 'native-base'
import React, { useState } from 'react'
import styled from 'styled-components'
import ModalCloseButton from './ModalCloseButton'
import Spacer from './Spacer'

const ModalView = styled.View({
  flex: 1,
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 15,
  marginTop: 40,
})

const AddNoteForm = ({ onCreate, onClose }) => {
  const [note, setNote] = useState()

  const createNote = () => onCreate(note)

  return (
    <ModalView>
      <ModalCloseButton onClose={onClose} />

      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Add note
      </Text>

      <Spacer value={12} />

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

      <Button block success onPress={createNote} disabled={!note}>
        <Text>Create note</Text>
      </Button>
    </ModalView>
  )
}

export default AddNoteForm
