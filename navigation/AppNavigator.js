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
  AppointmentDateScreen,
  ConfirmAppointmentScreen,
  LogoutScreen,
} from '../screens'
import { Button, Icon } from 'native-base'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const HeaderRight = ({ target }) => {
  const navigation = useNavigation()

  return (
    <Button transparent onPress={() => navigation.navigate(target)}>
      <Icon name='plus' type='Entypo' style={{ fontSize: 26, color: '#2A86FF' }} />
    </Button>
  )
}

const HeaderRightEdit = ({ target, patientId }) => {
  const navigation = useNavigation()

  return (
    <Button transparent onPress={() => navigation.navigate(target, { patientId })}>
      <Icon name='user-edit' type='FontAwesome5' style={{ fontSize: 22, color: '#2A86FF' }} />
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

const navOptionsBackButton = {
  headerTintColor: '#2A86FF',
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  headerBackTitleVisible: false,
}

function AppointmentCalendar({ route, navigation }) {
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
        options={({ route }) => {
          return {
            title: route.params ? route.params.headerTime : 'Укажите подробности',
            ...navOptionsNoBackButton,
          }
        }}
      />
    </Stack.Navigator>
  )
}

function AppointmentsList({ route, navigation }) {
  return (
    <Stack.Navigator initialRouteName='AppointmentsList'>
      <Stack.Screen
        name='AppointmentsList'
        component={HomeScreen}
        options={{ title: 'Appointments List', ...navOptionsNoBackButton }}
      />
      <Stack.Screen
        name='Patient'
        component={PatientScreen}
        options={{
          title: 'Карта пациента',
          ...navOptionsBackButton,
        }}
      />

      <Stack.Screen
        name='ToothFormula'
        component={ToothFormulaScreen}
        options={{
          title: 'Формула зубов',
          ...navOptionsBackButton,
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
              <HeaderRightEdit target={'EditPatient'} patientId={route.params.patientId} />
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

function Settings({ route, navigation }) {
  return (
    <Stack.Navigator initialRouteName='Settings'>
      <Stack.Screen
        name='Settings'
        component={LogoutScreen}
        options={{
          title: 'Настройки',
          ...navOptionsNoBackButton,
        }}
      />
    </Stack.Navigator>
  )
}

function Home({ navigation }) {
  return (
    <Tab.Navigator
      tabBarOptions={{
        inactiveTintColor: '#ccc',
        activeTintColor: '#2A86FF',
        /* showLabel: false, */
      }}
    >
      <Tab.Screen
        name='AppointmentsCalendarTab'
        component={AppointmentCalendar}
        options={{
          tabBarLabel: 'Запись на прием',
          tabBarIcon: ({ color }) => (
            <Icon name='calendar' type='Entypo' style={{ color: color }} />
          ),
        }}
        listeners={({navigation})=>(
          {
            tabPress: e => {
              e.preventDefault()
              navigation.navigate('AppointmentDateScreen')
            }
          }
        )}
      />
      <Tab.Screen
        name='AppointmentsListTab'
        component={AppointmentsList}
        options={{
          tabBarLabel: 'Список приемов',
          tabBarIcon: ({ color }) => <Icon name='list' type='Entypo' style={{ color: color }} />,
        }}
      />
      <Tab.Screen
        name='PatientsListTab'
        component={Patients}
        options={{
          tabBarLabel: 'Пациенты',
          tabBarIcon: ({ color }) => (
            <Icon name='user-friends' type='FontAwesome5' style={{ color: color }} />
          ),
        }}
      />
      <Tab.Screen
        name='SettingsTab'
        component={Settings}
        options={{
          tabBarLabel: 'Настройки',
          tabBarIcon: ({ color }) => <Icon name='cog' type='Entypo' style={{ color: color }} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default Home
