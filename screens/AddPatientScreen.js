import React from 'react'
import { Container, Content, Form, Item, Input, Label, Icon, Text, Button, View } from 'native-base'
import { useSelector } from 'react-redux'
import { TextInputMask } from 'react-native-masked-input'

import { patientsApi } from '../utils'

const AddPatientScreen = ({ navigation }) => {
  const token = useSelector((state) => state.auth.token)
  const [values, setValues] = React.useState({})
  const [error, setError] = React.useState('')
  const [responce, setResponce] = React.useState([])

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
    patientsApi.add(token, values).then(({ data }) => {
      setResponce(data)
      if (responce.error === 'BAD_REQUEST') {
        setError('please enter valid data')
      } else {
        navigation.navigate('PatientsList')
      }
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

          <View style={{ marginTop: 30 }}>
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
          </View>
          {!!error && (
            <Label style={{ marginTop: 20, fontSize: 16, alignSelf: 'center' }}>
              There is an error ocured: <Text style={{ color: 'tomato' }}>{error}</Text>
            </Label>
          )}
        </Form>
      </Content>
    </Container>
  )
}

export default AddPatientScreen
