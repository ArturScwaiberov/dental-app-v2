import { DefaultTabBar, Tab, Tabs, Text } from 'native-base'
import React from 'react'
import { View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { patientsApi } from '../../../utils'
import InvoiceSummary from './InvoiceSummary'
import ModalCloseButton from './ModalCloseButton'
import PaymentsTab from './PaymentsTab'
import ProceduresTab from './ProceduresTab'
import Spacer from './Spacer'
import * as patientsActions from '../../../store/actions/patients'

const ModalView = styled.View({
  backgroundColor: '#d9e3ff',
  flex: 1,
  borderRadius: 10,
  paddingTop: 15,
  marginTop: 40,
  overflow: 'hidden',
})

const InvoiceDetail = ({ invoice, onClose, onUpdate }) => {
  const renderTabBar = (props) => {
    props.tabStyle = Object.create(props.tabStyle)
    return <DefaultTabBar {...props} />
  }

  const token = useSelector((state) => state.auth.token)
  const patient = useSelector((state) => state.patients.currentPatient)
  const dispatch = useDispatch()

  const addPayment = async (data) => {
    await patientsApi.addInvoicePayment(token, patient.id, invoice.id, data)
    await dispatch(patientsActions.getPatient(token, patient.id))
    await onUpdate()
    onClose()
  }

  const updateOnPayment = async () => {
    await onUpdate()
    onClose()
  }

  return (
    <ModalView>
      <ModalCloseButton onClose={onClose} />
      <View style={{ paddingHorizontal: 10 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Invoice details
        </Text>
        <Spacer value={12} />

        <InvoiceSummary invoice={invoice} patientId={patient.id} onAddPayment={addPayment} />
      </View>
      <Spacer value={12} />

      <Tabs
        locked
        renderTabBar={renderTabBar}
        tabBarUnderlineStyle={{ backgroundColor: '#2A86FF' }}
        style={{ padding: 0, margin: 0 }}
      >
        <Tab
          heading='Procedures'
          tabStyle={{ backgroundColor: 'white' }}
          activeTabStyle={{
            backgroundColor: 'white',
          }}
          textStyle={{
            color: '#2A86FF',
            fontSize: 16,
            fontWeight: 'bold',
          }}
          activeTextStyle={{
            color: '#2A86FF',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          <ProceduresTab invoice={invoice} />
        </Tab>
        <Tab
          heading='Payments'
          tabStyle={{ backgroundColor: 'white' }}
          activeTabStyle={{
            backgroundColor: 'white',
          }}
          textStyle={{
            color: '#2A86FF',
            fontSize: 16,
            fontWeight: 'bold',
          }}
          activeTextStyle={{
            color: '#2A86FF',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          <PaymentsTab invoice={invoice} onAddPayment={addPayment} onUpdate={updateOnPayment} />
        </Tab>
      </Tabs>
    </ModalView>
  )
}

export default InvoiceDetail
