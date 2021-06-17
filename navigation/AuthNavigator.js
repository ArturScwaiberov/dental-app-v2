import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import AuthScreen from '../screens/AuthScreen'
import LoginScreen from '../screens/LoginScreen'

const Stack = createStackNavigator()

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='LoginScreen'
        options={{
          title: 'Please Login',
          headerTintColor: '#2A86FF',
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 28,
            textAlign: 'center',
          },
        }}
      >
        {({ navigation }) => <LoginScreen navigation={navigation} />}
      </Stack.Screen>
      <Stack.Screen
        name='AuthScreen'
        component={AuthScreen}
        options={{
          title: 'Registration',
          headerTintColor: '#2A86FF',
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 28,
            textAlign: 'center',
          },
          headerBackTitleVisible: false,
          headerLeft: () => {},
        }}
      />
    </Stack.Navigator>
  )
}
