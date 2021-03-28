import React, { useState } from 'react'
import { Container, Content, Form, Item, Input, Icon, Text, Button } from 'native-base'
import styled from 'styled-components/native'

const ConfirmNumberScreen = ({ navigation }) => {
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

  const submitHandler = () => {
    navigation.navigate('EnterPasswordScreen')
  }

  return (
    <Container>
      <Content style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}>
        <IconHolder>
          <Icon type='MaterialCommunityIcons' name='email-lock' style={{ color: '#777' }} />
        </IconHolder>
        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
          SMS с кодом отправлено на номер +996700126646
        </Text>
        <Text style={{ textAlign: 'center', marginTop: 15, marginBottom: 15 }}>
          Введите в поле полученный код подтверждения
        </Text>
        <Form>
          <Item picker>
            <Input
              onChange={handleInputChange.bind(this, 'smsCode')}
              value={values.smsCode}
              keyboardType='number-pad'
              placeholder='****'
              secureTextEntry
              placeholderTextColor='#777'
              maxLength={4}
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
              <Text style={{ color: '#fff' }}>Подтвердить</Text>
              <Icon type='MaterialIcons' name='navigate-next' style={{ color: '#fff' }} />
            </Button>
          </ButtonView>
        </Form>
      </Content>
    </Container>
  )
}

const ButtonView = styled.View({
  marginTop: 30,
})

const IconHolder = styled.View({
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 15,
})

export default ConfirmNumberScreen
