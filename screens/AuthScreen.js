import React, { useState } from 'react'
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Icon,
  Text,
  Button,
  Thumbnail,
} from 'native-base'
import styled from 'styled-components/native'

import { patientsApi } from '../utils'
import { Alert, Keyboard } from 'react-native'

const AuthScreen = ({ navigation }) => {
  const [values, setValues] = useState({})

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

  const fieldsName = {
    firstName: '"имя"',
    lastName: '"фамилия"',
    phone: '"телефон"',
    gender: '"пол"',
  }

  /* const submitHandler = () => {
    patientsApi
      .add(values)
      .then(() => {
        navigation.navigate('PatientsList')
      })
      .catch((e) => {
        if (e.response.data && e.response.data.message) {
          Keyboard.dismiss()
          e.response.data.message.forEach((err) => {
            const fieldErr = err.msg
            const fieldName = err.param
            Alert.alert(`Поле ${fieldsName[fieldName]}`, fieldErr)
          })
        }
      })
  } */

  const submitHandler = () => {
    navigation.navigate('ConfirmNumberScreen')
  }

  return (
    <Container>
      <Content style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}>
        <Thumbnail
          source={require('../src/images/dent_example_logo.jpg')}
          style={{ height: 200, width: null, flex: 1 }}
        />
        <Form>
          <Item picker>
            <Input
              onChange={handleInputChange.bind(this, 'firstName')}
              value={values.firstName}
              clearButtonMode='while-editing'
              placeholder='* Имя (мин 4)'
              placeholderTextColor='#777'
            />
          </Item>
          <Item picker>
            <Input
              onChange={handleInputChange.bind(this, 'lastName')}
              value={values.lastName}
              clearButtonMode='while-editing'
              placeholder='* Фамилия (мин 4)'
              placeholderTextColor='#777'
            />
          </Item>
          <Item picker>
            <Input
              onChange={handleInputChange.bind(this, 'phone')}
              value={values.phone}
              keyboardType='phone-pad'
              clearButtonMode='while-editing'
              placeholder='* 996 *** *** ***'
              placeholderTextColor='#777'
            />
          </Item>

          <ButtonView>
            <Button
              onPress={submitHandler}
              rounded
              /* block
              iconLeft */
              style={{ backgroundColor: '#84D269' }}
            >
              <Text style={{ color: '#fff' }}>Регистрация</Text>
              <Icon type='MaterialIcons' name='navigate-next' style={{ color: '#fff' }} />
            </Button>
          </ButtonView>
          <Label style={{ marginTop: 20, fontSize: 14, color: '#777', textAlign: 'center' }}>
            Поля помеченные звездочкой <TomatoText>*</TomatoText> обязательны для заполнения
          </Label>
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
export default AuthScreen
