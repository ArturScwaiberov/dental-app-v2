import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import styled from 'styled-components'

const Container = styled.View({
  alignItems: 'flex-end',
  position: 'absolute',
  top: 10,
  right: 10,
  padding: 5,
  zIndex: 1111,
})

const ContainerNoPadding = styled.View({
  alignItems: 'flex-end',
  position: 'absolute',
  top: 5,
  right: 0,
  padding: 5,
  zIndex: 1111,
})

const ModalCloseButton = ({ onClose, padding }) => {
  if (padding) {
    return (
      <ContainerNoPadding>
        <Ionicons name='close' size={24} color='black' onPress={onClose} />
      </ContainerNoPadding>
    )
  } else {
    return (
      <Container>
        <Ionicons name='close' size={24} color='black' onPress={onClose} />
      </Container>
    )
  }
}

export default ModalCloseButton
