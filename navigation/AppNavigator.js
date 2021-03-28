import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import {
  HomeScreen,
  PatientScreen,
  AddPatientScreen,
  PatientsListScreen,
  AddAppointmentScreen,
  EditPatientScreen,
  EditAppointmentScreen,
  ToothFormulaScreen,
} from '../screens'
import { Button, Icon } from 'native-base'

import AppointmentDateScreen from '../screens/AppointmentDateScreen'
import ConfirmAppointmentScreen from '../screens/ConfirmAppointmentScreen'
import LogoutScreen from '../screens/LogoutScreen'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const HeaderRight = ({ patientId, target }) => {
  const navigation = useNavigation()

  return (
    <Button transparent onPress={() => navigation.navigate(target, { patientId })}>
      <Icon name='plus' type='Entypo' style={{ fontSize: 26, color: '#2A86FF' }} />
    </Button>
  )
}

const navOptionsNoBackButton = {
  headerTintColor: '#2A86FF',
  headerTitleAlign: 'left',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
  },
  headerBackTitleVisible: false,
  headerLeft: () => {},
}

const navOptions = {
  headerTintColor: '#2A86FF',
  headerTitleAlign: 'left',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
  },
}

function Appointments({ route, navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='AppointmentDateScreen'
        component={AppointmentDateScreen}
        options={{
          title: 'Запись на прием',
          ...navOptionsNoBackButton,
        }}
      />
      <Stack.Screen
        name='ConfirmAppointmentScreen'
        component={ConfirmAppointmentScreen}
        options={{
          title: 'Укажите подробности',
          ...navOptionsNoBackButton,
        }}
      />
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          title: 'Приемы',
          ...navOptionsNoBackButton,
        }}
      />
      <Stack.Screen
        name='Patient'
        component={PatientScreen}
        options={{
          title: 'Карта пациента',
          ...navOptionsNoBackButton,
        }}
      />
      <Stack.Screen
        name='ToothFormula'
        component={ToothFormulaScreen}
        options={{
          title: 'Формула зубов',
          ...navOptionsNoBackButton,
        }}
      />
      <Stack.Screen
        name='EditAppointment'
        component={EditAppointmentScreen}
        options={{
          title: 'Редактировать прием',
          ...navOptionsNoBackButton,
        }}
      />
    </Stack.Navigator>
  )
}

function Patients({ route, navigation }) {
  return (
    <Stack.Navigator initialRouteName='PatientsList'>
      <Stack.Screen
        name='PatientsList'
        component={PatientsListScreen}
        options={{
          title: 'Пациенты',
          headerTintColor: '#2A86FF',
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 28,
          },
          headerRight: () => <HeaderRight target={'AddPatient'} />,
        }}
      />
      <Stack.Screen
        name='Patient'
        component={PatientScreen}
        options={({ route, navigation }) => {
          return {
            title: 'Карта пациента',
            headerTintColor: '#2A86FF',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
            headerRight: () => (
              <HeaderRight target={'AddAppointment'} patientId={route.params.patientId} />
            ),
          }
        }}
      />
      <Stack.Screen
        name='ToothFormula'
        component={ToothFormulaScreen}
        options={{
          title: 'Формула зубов',
          headerTintColor: '#2A86FF',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name='AddPatient'
        component={AddPatientScreen}
        options={{
          title: 'Добавить пациента',
          headerTintColor: '#2A86FF',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name='AddAppointment'
        component={AddAppointmentScreen}
        options={{
          title: 'Добавить прием',
          headerTintColor: '#2A86FF',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name='EditPatient'
        component={EditPatientScreen}
        options={{
          title: 'Редактировать пацента',
          headerTintColor: '#2A86FF',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  )
}

function Settings({ route, navigation, signOut }) {
  return (
    <Stack.Navigator initialRouteName='Settings'>
      <Stack.Screen
        name='Settings'
        options={{
          title: 'Настройки',
          ...navOptionsNoBackButton,
        }}
      >
        {() => <LogoutScreen signOut={signOut} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

function Home({ navigation, signOut }) {
  return (
    <Tab.Navigator
      tabBarOptions={{
        inactiveTintColor: '#ccc',
        activeTintColor: '#2A86FF',
        showLabel: false,
      }}
    >
      <Tab.Screen
        name='Приемы'
        component={Appointments}
        options={{
          tabBarLabel: 'Приемы',
          tabBarIcon: ({ color }) => (
            <Icon name='calendar' type='Entypo' style={{ color: color }} />
          ),
        }}
      />
      <Tab.Screen
        name='Пациенты'
        component={Patients}
        options={{
          tabBarLabel: 'Пациенты',
          tabBarIcon: ({ color }) => (
            <Icon name='user-friends' type='FontAwesome5' style={{ color: color }} />
          ),
        }}
      />
      <Tab.Screen
        name='Настройки'
        options={{
          tabBarLabel: 'Настройки',
          tabBarIcon: ({ color }) => <Icon name='cog' type='Entypo' style={{ color: color }} />,
        }}
      >
        {() => <Settings signOut={signOut} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

export default Home
