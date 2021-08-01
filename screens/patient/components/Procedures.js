import { Button, Header, Icon, Input, Item, Text } from 'native-base'
import React, { useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { patientsApi } from '../../../utils'
import ModalCloseButton from './ModalCloseButton'
import ProcedureItem from './ProcedureItem'
import Spacer from './Spacer'

const ModalView = styled.View({
  backgroundColor: '#F4F5F8',
  flex: 1,
  borderRadius: 10,
  padding: 15,
  marginTop: 40,
})

const Procedure = ({ procedure, onPress, disabled }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
          borderBottomColor: 'lightgray',
          borderBottomWidth: 1,
          opacity: disabled ? 0.4 : 1,
        }}
      >
        <Text style={{ width: '70%' }}>{procedure.name}</Text>
        <Text
          style={{
            width: '30%',
            textAlign: 'right',
          }}
        >
          ${procedure.fee}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const Procedures = ({ category, onClose, onAddProcedures }) => {
  const [searchText, setSearchText] = useState('')
  const [selectedProcedures, setSelectedProcedures] = useState([])

  const procedures = useSelector((state) =>
    state.common.procedures
      .filter((p) => p.categoryIndex === category?.index)
      .map((p) => ({ ...p, feeDefault: p.fee }))
  )

  const token = useSelector((state) => state.auth.token)
  const patient = useSelector((state) => state.patients.currentPatient)

  const selectProcedure = (procedure) => () => {
    setSelectedProcedures([
      {
        ...procedure,
        qty: 1,
      },
      ...selectedProcedures,
    ])
  }

  const decreaseQuantity = (id) => () => {
    setSelectedProcedures(
      selectedProcedures.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            qty: p.qty > 1 ? p.qty - 1 : p.qty,
          }
        }
        return p
      })
    )
  }

  const increaseQuantity = (id) => () => {
    setSelectedProcedures(
      selectedProcedures.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            qty: p.qty + 1,
          }
        }
        return p
      })
    )
  }

  const deleteProcedure = (id) => () => {
    setSelectedProcedures(selectedProcedures.filter((p) => p.id !== id))
  }

  const addProcedures = async () => {
    await patientsApi.addProcedures(token, patient.id, {
      data: selectedProcedures,
    })
    onAddProcedures(selectedProcedures)
    onClose()
  }

  const renderItem = ({ item }) => (
    <Procedure
      procedure={item}
      onPress={selectProcedure(item)}
      disabled={selectedProcedures.some((p) => p.id === item.id)}
    />
  )

  const renderSelectedItem = ({ item }) => (
    <ProcedureItem
      procedure={item}
      onDecrease={decreaseQuantity(item.id)}
      onIncrease={increaseQuantity(item.id)}
      onDelete={deleteProcedure(item.id)}
    />
  )

  const invoiceTotal = selectedProcedures.reduce((a, c) => a + c.qty * c.fee, 0).toFixed(2)

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
        {category?.name}
      </Text>

      <Spacer value={12} />

      <Header searchBar rounded>
        <Item style={{ borderRadius: 10 }}>
          <Icon name='ios-search' />
          <Input
            placeholder='Search...'
            value={searchText}
            onChangeText={setSearchText}
            clearButtonMode='always'
          />
        </Item>
      </Header>
      <Spacer value={12} />
      <Text>{selectedProcedures.length} selected procedures</Text>
      <Spacer value={8} />

      {selectedProcedures.length ? (
        <>
          <FlatList
            data={selectedProcedures}
            keyExtractor={(item) => item.id}
            renderItem={renderSelectedItem}
          />
          <Spacer value={12} />
          <Button block success onPress={addProcedures}>
            <Text>Add procedures - ${invoiceTotal}</Text>
          </Button>
        </>
      ) : null}
      <FlatList
        data={procedures.filter((p) => p.name.match(new RegExp(searchText, 'i')))}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </ModalView>
  )
}

export default Procedures
