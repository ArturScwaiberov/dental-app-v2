import { FontAwesome5, Foundation, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Linking, Platform } from 'react-native'
import styled from 'styled-components'

const ActionButtons = ({ patient, onAddNote, onPayment, onCreateInvoice }) => {
  const navigation = useNavigation()

  const goToToothFormula = () => {
    navigation.navigate('ToothFormula', {
      userId: patient.id,
      appointments: patient.appointments,
    })
  }

  return (
    <ButtonsWrapper>
      <ToothButton onPress={goToToothFormula}>
        <FontAwesome5 name='tooth' size={28} color='white' />
      </ToothButton>
      <MoneyButton onPress={onPayment}>
        <MaterialIcons name='monetization-on' size={28} color='white' />
      </MoneyButton>
      <InvoiceButton onPress={onCreateInvoice}>
        <Ionicons name='ios-card' size={28} color='white' />
      </InvoiceButton>
      <NoteButton onPress={onAddNote}>
        <Ionicons style={{ paddingLeft: 3.5 }} name='ios-create-outline' size={28} color='white' />
      </NoteButton>
      <CallButton onPress={() => Linking.openURL('tel:' + patient?.person?.phone)}>
        <Foundation
          style={{ marginTop: Platform.OS === 'ios' ? 2 : 0 }}
          name='telephone'
          size={30}
          color='white'
        />
      </CallButton>
    </ButtonsWrapper>
  )
}

const ButtonsWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginHorizontal: 10,
})

const CallButton = styled.TouchableOpacity({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '45px',
  width: '45px',
  height: '45px',
  backgroundColor: '#84D269',
  marginLeft: 10,
})

const InvoiceButton = styled.TouchableOpacity({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '45px',
  width: '45px',
  height: '45px',
  backgroundColor: '#f87300',
  marginLeft: 10,
})

const MoneyButton = styled.TouchableOpacity({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '45px',
  width: '45px',
  height: '45px',
  backgroundColor: '#84D269',
  marginLeft: 10,
})

const ToothButton = styled.TouchableOpacity({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '45px',
  width: '45px',
  height: '45px',
  backgroundColor: '#2A86FF',
  marginLeft: 10,
})

const NoteButton = styled.TouchableOpacity({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '45px',
  width: '45px',
  height: '45px',
  backgroundColor: '#fccd4a',
  marginLeft: 10,
})

export default ActionButtons
