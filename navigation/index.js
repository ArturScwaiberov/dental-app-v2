import React from 'react'
import { StyleSheet, ActivityIndicator, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'

import AuthNavigator from './AuthNavigator'
import AppNavigator from './AppNavigator'
import * as authAction from '../store/actions/auth'

const AuthLoadingScreen = () => {
  const [userToken, setUserToken] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const token = useSelector((state) => state.auth.token)
  const dispatch = useDispatch()

  React.useEffect(() => {
    setLoading(true)
    if (token) {
      setUserToken(token)
      setLoading(false)
    } else {
      loadApp((loggedIn) => {
        if (!loggedIn) {
          setUserToken(null)
        }
        setLoading(false)
      })
    }
  }, [token])

  const loadApp = async (cb) => {
    try {
      await dispatch(authAction.loginCurrent(cb))
    } catch (err) {
      setError(err)
    }
  }

  let view = ''

  if (loading) {
    view = <ActivityIndicator style={{ paddingTop: 100 }} size='large' color='#2A86FF' />
  } else if (!userToken) {
    view = <AuthNavigator />
  } else {
    view = <AppNavigator />
  }

  if (error.length > 0) {
    return <Text style={styles.label}>{error}</Text>
  }

  return <NavigationContainer>{view}</NavigationContainer>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 20,
    fontSize: 16,
    color: '#484848',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
})

export default AuthLoadingScreen
