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
    setLoading(true)
    if (token) {
      setUserToken(token)
      setLoading(false)
    } else {
      loadApp((loggedIn)=>{
        if(!loggedIn){
          setUserToken(null)
        }
        setLoading(false)
      })
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

  const loadApp = async (cb) => {
    try {
      await dispatch(authAction.loginCurrent(cb))
    } catch (err) {
      console.log(err)
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
