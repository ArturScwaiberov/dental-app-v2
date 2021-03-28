import React from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'

import AuthNavigator from './AuthNavigator'
import AppNavigator from './AppNavigator'
import * as authAction from '../store/actions/auth'

const AuthLoadingScreen = (props) => {
  const [userToken, setUserToken] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const token = useSelector((state) => state.auth.token)
  const dispatch = useDispatch()
  /* console.log('token____', token) */

  React.useEffect(() => {
    if (token) {
      setUserToken(token)
    } else {
      loadApp()
    }
  }, [token])

  //можно это вырубить после того как будет подключен AsyncStorage
  /* const loadAppFast = async () => {
    await Auth.currentAuthenticatedUser()
      .then((user) => {
        setUserToken(user.signInUserSession.accessToken.jwtToken)
      })
      .catch((err) => {
        console.log('ERROR sign in:', err)
      })
    setLoading(false)
  } */

  const loadApp = () => {
    setLoading(true)
    try {
      dispatch(authAction.loginCurrent())
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const signOut = async () => {
    try {
      await dispatch(authAction.logout())
    } catch (err) {
      console.log(err)
    }

    setUserToken(null)
  }

  /* const signIn = async () => {
    setUserToken(token)
  } */

  const showLoadingSpinner = !userToken && loading
  let view = ''

  if (showLoadingSpinner) {
    view = (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='#aaa' />
      </View>
    )
  } else if (!userToken) {
    view = <AuthNavigator />
  } else {
    view = <AppNavigator signOut={signOut} />
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
})

export default AuthLoadingScreen
