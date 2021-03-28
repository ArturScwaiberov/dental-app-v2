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
  Spinner,
} from 'native-base'
import styled from 'styled-components/native'
import { Alert, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import * as authAction from '../store/actions/auth'

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const dispatch = useDispatch()

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

  /* const submitHandler = () => {
    navigation.navigate('ConfirmNumberScreen')
  } */

  /* const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('') */

  const submitHandler = async () => {
    setLoading(true)
    try {
      await dispatch(authAction.login(values.email, values.password))
    } catch (err) {
      Alert.alert('Error', err.message)
    }
    setLoading(false)
  }

  return (
    <Container>
      <Content style={styles.content}>
        <Thumbnail
          source={require('../src/images/dent_example_logo.jpg')}
          style={styles.thumbnail}
        />
        <Form>
          <Label style={styles.label}>Введите Ваш email</Label>

          <Item picker>
            <Input
              onChange={handleInputChange.bind(this, 'email')}
              value={values.email}
              keyboardType='email-address'
              clearButtonMode='while-editing'
              autoCompleteType='email'
              placeholder='email@example.com'
              placeholderTextColor='#777'
            />
          </Item>

          <Label style={styles.label}>Введите Ваш пароль</Label>

          <Item picker>
            <Input
              onChange={handleInputChange.bind(this, 'password')}
              value={values.password}
              secureTextEntry
              clearButtonMode='while-editing'
              autoCompleteType='password'
              placeholder='password'
              placeholderTextColor='#777'
            />
          </Item>

          {loading ? (
            <Spinner color='blue' size='large' color='#2A86FF' />
          ) : (
            <ButtonView>
              <Button
                onPress={submitHandler}
                rounded
                block
                style={{
                  backgroundColor:
                    values.email && values.password ? '#84D269' : 'rgba(132, 210, 105, 0.5)',
                }}
                disabled={values.email && values.password ? false : true}
              >
                <Text style={styles.buttonText}>Далее</Text>
                <Icon type='MaterialIcons' name='navigate-next' style={{ color: '#fff' }} />
              </Button>
              <Text style={errorMessage.length > 0 ? styles.label : null}>{errorMessage}</Text>
            </ButtonView>
          )}
          <Label style={styles.bottomText}>
            Нет аккаунта?{' '}
            <TomatoText
              onPress={() => {
                navigation.navigate('AuthScreen')
              }}
            >
              Регистрация
            </TomatoText>
          </Label>
        </Form>
      </Content>
    </Container>
  )
}

const ButtonView = styled.View({
  marginTop: 30,
  alignItems: 'center',
})

const TomatoText = styled.Text({
  color: 'tomato',
  fontFamily: 'Roboto',
})

const styles = StyleSheet.create({
  content: { paddingTop: 20, paddingLeft: 20, paddingRight: 20 },
  thumbnail: { height: 200, width: null },
  label: {
    marginTop: 20,
    fontSize: 16,
    color: '#484848',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  buttonText: { color: '#fff', fontFamily: 'Roboto', fontWeight: 'bold' },
  bottomText: {
    marginTop: 20,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
})

export default LoginScreen
