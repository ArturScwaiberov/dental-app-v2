import React, { useState } from 'react'
import { Container, Content, Form, Item, Input, Label, Icon, Text, Button } from 'native-base'
import styled from 'styled-components/native'
import { useSelector } from 'react-redux'
import { TextInputMask } from 'react-native-masked-input'

import { patientsApi } from '../utils'

const AddPatientScreen = ({ navigation }) => {
  const token = useSelector((state) => state.auth.token)
  const [values, setValues] = useState({})
  const [error, setError] = useState('')
  console.log('values', values)

  const setFieldValue = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    })
  }

  const handleInputChange = (name, e) => {
    const text = e.nativeEvent.text
    setFieldValue(name, text)
  }

  const submitHandler = () => {
    patientsApi
      .add(token, values)
      .then(() => {
        navigation.navigate('PatientsList')
      })
      .catch((e) => {
        console.log(e)
        setError(e.message)
      })
  }

  return (
    <Container>
      <Content style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Form>
          <Item picker>
            <Input
              onChange={handleInputChange.bind(this, 'fullName')}
              value={values.fullName}
              clearButtonMode='while-editing'
              placeholder='Full name'
            />
          </Item>

          <Item picker>
            <TextInputMask
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '+1(999)999-9999',
              }}
              value={values.phone}
              keyboardType='phone-pad'
              placeholder='+1(312)123-4567'
              maxLength={15}
              onChangeText={(maskedText) => {
                setFieldValue('phone', maskedText)
              }}
              style={{ fontSize: 17, paddingVertical: 10 }}
            />
          </Item>

          <Item picker>
            <TextInputMask
              type={'datetime'}
              options={{
                format: 'YYYY/MM/DD',
              }}
              value={values.birthday}
              keyboardType='number-pad'
              placeholder='YYYY/MM/DD'
              onChangeText={(text) => {
                setFieldValue('birthday', text)
              }}
              style={{ fontSize: 17, paddingVertical: 10 }}
            />
          </Item>

          <ButtonView>
            <Button
              onPress={submitHandler}
              rounded
              block
              style={{
                backgroundColor:
                  values.fullName && values.phone && values.birthday
                    ? '#84D269'
                    : 'rgba(132, 210, 105, 0.5)',
              }}
              disabled={values.fullName && values.phone && values.birthday ? false : true}
            >
              <Text style={{ color: '#fff' }}>Добавить пациента</Text>
              <Icon type='Entypo' name='plus' style={{ color: '#fff' }} />
            </Button>
          </ButtonView>
          {!!error && (
            <Label style={{ marginTop: 20, fontSize: 16, alignSelf: 'center' }}>
              There is an error ocured: <TomatoText>{error}</TomatoText>
            </Label>
          )}
        </Form>
      </Content>
    </Container>
  )
}

const ButtonView = styled.View({
  marginTop: 30,
})

const TomatoText = styled.Text({
  color: 'tomato',
})

export default AddPatientScreen
