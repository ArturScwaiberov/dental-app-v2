import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import { GrayText } from '../../../src/components'
import Spacer from './Spacer'

const PatientDetail = ({ patient, isMinimal }) => {
  const fullName = patient?.person?.fullName
  const totalInvoiced = patient?.statsInvoices?.totalInvoiced
  const totalDebts = patient?.statsInvoices?.totalDebts
  const phone = patient?.person?.phone
  const birthday = patient?.person?.birthday
  const balance = patient?.balance

  return (
    <View
      style={{
        paddingHorizontal: 20,
      }}
    >
      <PatientFullName>{fullName}</PatientFullName>
      <Spacer value={8} />
      <GrayText>Total invoiced: {totalInvoiced}</GrayText>
      {!isMinimal && (
        <>
          <Spacer value={8} />
          <GrayText>Total debts: {totalDebts}</GrayText>
          <Spacer value={8} />
          <GrayText>Total balance: {balance}</GrayText>
          <Spacer value={8} />
          <GrayText>Birth date: {birthday}</GrayText>
          <Spacer value={12} />
        </>
      )}
    </View>
  )
}

const PatientFullName = styled.Text({
  fontWeight: 'bold',
  fontSize: 20,
})

export default PatientDetail
