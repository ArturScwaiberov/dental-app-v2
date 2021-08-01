import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import * as dateFns from 'date-fns'
import { View } from 'native-base'
import React, { useState } from 'react'
import { FlatList, Pressable } from 'react-native'
import Modal from 'react-native-modal'
import styled from 'styled-components'
import InvoiceDetail from './InvoiceDetail'
import ListEmpty from './ListEmpty'

const Bold = styled.Text({
  color: '#000',
  fontSize: 16,
  fontWeight: 'bold',
})

const AppointmentCardRow = styled.View({
  flexDirection: 'row',
  marginBottom: 7.5,
  marginTop: 7.5,
})

const AppointmentCardLabel = styled.Text({
  color: '#000',
  fontSize: 16,
  flex: 1,
  flexWrap: 'wrap',
})

const AppointmentCard = styled.View({
  paddingHorizontal: 15,
  paddingVertical: 5,
  borderRadius: 10,
  marginBottom: 10,
  backgroundColor: '#fff',
})

/**CHECK LATER: Make this component more lighther if FlatList is slow:*/
const ListItem = ({ item, clinicUsers, onPress }) => {
  const isFullyPaid = item.paidAmount - item.totalAmount === 0
  return (
    <Pressable onPress={onPress}>
      <AppointmentCard>
        <AppointmentCardRow>
          <FontAwesome5
            style={{ marginRight: 7 }}
            name='file-invoice-dollar'
            size={20}
            color='#A3A3A3'
          />
          <AppointmentCardLabel>
            Invoice # <Bold>{item.internalIndex}</Bold>
          </AppointmentCardLabel>
        </AppointmentCardRow>
        <AppointmentCardRow>
          <MaterialCommunityIcons
            style={{ marginRight: 7 }}
            name='calendar-outline'
            size={20}
            color='#A3A3A3'
          />
          <AppointmentCardLabel>
            Created at: <Bold>{dateFns.format(new Date(item.createdAt), 'yyyy-MM-dd, HH:mm')}</Bold>
          </AppointmentCardLabel>
        </AppointmentCardRow>

        <AppointmentCardRow>
          <Ionicons
            style={{ marginRight: 7 }}
            name='ios-person-circle-outline'
            size={20}
            color='#A3A3A3'
          />
          <AppointmentCardLabel>
            Doctor:{' '}
            <Bold>{clinicUsers.find((user) => user.id === item.createdCustomerId)?.fullName}</Bold>
          </AppointmentCardLabel>
        </AppointmentCardRow>

        <AppointmentCardRow>
          <Ionicons style={{ marginRight: 7 }} name='md-document' size={20} color='#A3A3A3' />
          <AppointmentCardLabel>
            Sum:{' '}
            <Bold style={isFullyPaid ? { color: 'green' } : {}}>
              {isFullyPaid ? item.paidAmount : item.paidAmount - item.totalAmount}
            </Bold>
          </AppointmentCardLabel>
        </AppointmentCardRow>
      </AppointmentCard>
    </Pressable>
  )
}

const MemoizedListItem = React.memo(ListItem)

const InvoicesTab = ({ invoices, common, onUpdate }) => {
  const { users: clinicUsers } = common

  const [invoice, setInvoice] = useState()
  const showInvoice = (invoice) => () => setInvoice(invoice)
  const hideInvoice = () => setInvoice(null)

  const renderItem = ({ item }) => (
    <MemoizedListItem item={item} clinicUsers={clinicUsers} onPress={showInvoice(item)} />
  )

  return (
    <View style={{ backgroundColor: invoices.length > 0 ? '#eee' : '#fff' }}>
      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={{ padding: 10, paddingBottom: 0 }}
      />
      <Modal isVisible={!!invoice} onBackdropPress={hideInvoice}>
        <InvoiceDetail invoice={invoice} onClose={hideInvoice} onUpdate={onUpdate} />
      </Modal>
    </View>
  )
}

export default InvoicesTab
