import React, { useState } from 'react'
import { Container, Content, Icon, Input, Item, Text, Button, Form, Textarea } from 'native-base'
import styled from 'styled-components/native'

const ConfirmAppointmentScreen = ({ navigation, route }) => {
  const [values, setValues] = useState({})
  const [desc, setDesc] = useState('')
  const [wishes, setWishes] = useState('')

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
    navigation.navigate('Home')
  }

  console.log('desc', desc)
  console.log('wishes', wishes)

  return (
    <Container>
      <Content style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}>
        <Form>
          <Textarea
            rowSpan={6}
            bordered
            placeholder='Введите описание или симптомы'
            onChangeText={(text) => {
              setDesc(text)
            }}
          />
          <Textarea
            rowSpan={5}
            bordered
            placeholder='Укажите ваши пожелания'
            onChangeText={(text) => setWishes(text)}
          />
          <ButtonView>
            <Button
              onPress={submitHandler}
              rounded
              /* block
              iconLeft */
              style={{ backgroundColor: '#84D269' }}
            >
              <Text style={{ color: '#fff' }}>Записаться на прием</Text>
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

export default ConfirmAppointmentScreen
