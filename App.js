import React from 'react'
import * as Font from 'expo-font'
import AppLoading from 'expo-app-loading'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import Amplify from '@aws-amplify/core'

import config from './aws-exports'
import AppNavigation from './navigation'
import authReducer from './store/reducers/auth'
import commonReducer from './store/reducers/common'
import patientsReducer from './store/reducers/patients'

Amplify.configure(config)

const rootReducer = combineReducers({
  auth: authReducer,
  common: commonReducer,
  patients: patientsReducer,
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

async function fetchFonts() {
  await Font.loadAsync({
    Roboto: require('./node_modules/native-base/Fonts/Roboto.ttf'),
    Roboto_medium: require('./node_modules/native-base/Fonts/Roboto_medium.ttf'),
  })
}

export default function App() {
  const [isReady, setIsReady] = React.useState(false)

  if (!isReady) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setIsReady(true)}
        onError={(err) => console.log(err)}
      />
    )
  }

  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  )
}
