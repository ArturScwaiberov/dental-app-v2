import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSelector } from 'react-redux'
import * as dateFns from 'date-fns'

import {
  HomeScreen,
  // PatientScreen,
  AddPatientScreen,
  PatientsListScreen,
  EditPatientScreen,
  ToothFormulaScreen,
  AppointmentDateScreen,
  ConfirmAppointmentScreen,
  LogoutScreen,
} from '../screens'
import { Button, Icon, View } from 'native-base'
import { TouchableOpacity } from 'react-native'

import PatientScreen from '../screens/patient'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const HeaderRight = ({ target }) => {
  const navigation = useNavigation()

  return (
    <Button transparent onPress={() => navigation.navigate(target)}>
      <Icon name='add' type='Ionicons' style={{ fontSize: 26, color: '#2A86FF' }} />
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
}

function AppointmentCalendar({ route, navigation }) {
  const selectedDay = useSelector((state) => state.calendar.selectedDay)
  const selectedTimeSlots = useSelector((state) => state.calendar.selectedTimeSlots)

  const goToConfirmScreen = () => {
    const startAt = selectedTimeSlots[0].startAt
    const startTime = dateFns.format(startAt, 'HH:mm:ss')
    const endTime = dateFns.format(
      dateFns.addMinutes(startAt, selectedTimeSlots.length * 15),
      'HH:mm:ss'
    )

    const clinics = selectedTimeSlots.map((s) => s.clinicSectionIds)
    const customers = selectedTimeSlots.map((s) => s.customerIds)

    const clinicSectionIds = clinics.reduce((a, b) => a.filter((c) => b.includes(c)))
    const customerIds = customers.reduce((a, b) => a.filter((c) => b.includes(c)))

    navigation.navigate('ConfirmAppointmentScreen', {
      headerTime: `${dateFns.format(startAt, 'HH:mm')} - ${dateFns.format(
        dateFns.addMinutes(startAt, selectedTimeSlots.length * 15),
        'HH:mm'
      )}, ${dateFns.format(selectedDay, 'dd MMM')}`,
      date: dateFns.format(selectedDay, 'YYY-MM-dd'),
      startTime,
      endTime,
      clinicSectionIds,
      customerIds,
    })
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='AppointmentDateScreen'
        component={AppointmentDateScreen}
        options={{
          title: 'Create Appointment',
          ...navOptionsNoBackButton,
          headerLeft: () => (selectedTimeSlots.length ? <View style={{ width: 40 }} /> : null),
          headerRight: () =>
            selectedTimeSlots.length ? (
              <TouchableOpacity
                style={{
                  right: 20,
                  width: 40,
                  height: 40,
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={goToConfirmScreen}
              >
                <Icon
                  name='checkmark-done'
                  type='Ionicons'
                  style={{
                    color: '#84D269',
                  }}
                />
              </TouchableOpacity>
            ) : null,
        }}
      />
      <Stack.Screen
        name='ConfirmAppointmentScreen'
        component={ConfirmAppointmentScreen}
        options={({ route }) => {
          return {
            title: route.params ? route.params.headerTime : 'Choose date and time',
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
        options={{ title: 'Appointments', ...navOptionsNoBackButton }}
      />
      <Stack.Screen
        name='Patient'
        component={PatientScreen}
        options={({ route, navigation }) => {
          return {
            title: 'Medical Record',
            ...navOptionsBackButton,
          }
        }}
      />

      <Stack.Screen
        name='ToothFormula'
        component={ToothFormulaScreen}
        options={{
          title: 'Tooth Formula',
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
          title: 'Patients',
          headerTintColor: '#2A86FF',
          headerTitleAlign: 'center',
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
            title: 'Medical Record',
            headerTintColor: '#2A86FF',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
            /* headerRight: () => (
              <HeaderRightEdit target={'EditPatient'} patientId={route.params.patientId} />
            ), */
          }
        }}
      />
      <Stack.Screen
        name='ToothFormula'
        component={ToothFormulaScreen}
        options={{
          title: 'Tooth Formula',
          ...navOptionsBackButton,
        }}
      />
      <Stack.Screen
        name='AddPatient'
        component={AddPatientScreen}
        options={{
          title: 'Add Patient',
          ...navOptionsBackButton,
        }}
      />
      <Stack.Screen
        name='EditPatient'
        component={EditPatientScreen}
        options={{
          title: 'Edit Patient',
          ...navOptionsBackButton,
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
          title: 'About clinic',
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
        showLabel: false,
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
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault()
            navigation.navigate('AppointmentDateScreen')
          },
        })}
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
