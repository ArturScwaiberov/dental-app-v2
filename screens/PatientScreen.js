import React, { useEffect, useState } from 'react'
import { Animated, Platform, RefreshControl, Linking, ActivityIndicator } from 'react-native'
import { Foundation, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { GrayText, Button, Badge } from '../src/components'
import { appointmentsApi, patientsApi } from '../utils'

const PatientScreen = ({ route, navigation }) => {
  const { patientId } = route.params
  const [appointments, setAppointments] = useState([])
  const [currentPatient, setCurrentPatient] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0))
  const AnimatedGrayText = Animated.createAnimatedComponent(GrayText)
  const token = useSelector((state) => state.auth.token)
  const common = useSelector((state) => state.common)
  const isRefreshing = useSelector((state) => state.patients.loading)
  const clinicUsers = common.users
  const clinicSections = common.sections
  const [error, setError] = React.useState('')

  const fetchPatientsAppointments = async () => {
    await appointmentsApi
      .get(token, patientId)
      .then(({ data }) => {
        setAppointments(data)
      })
      .catch((error) => {
        setError('Error: ' + error.message)
      })
  }

  const fetchAll = async () => {
    await appointmentsApi
      .get(token, patientId)
      .then(({ data }) => {
        setAppointments(data)
      })
      .catch((error) => {
        setError('Error: ' + error.message)
      })

    await patientsApi
      .getPatient(token, patientId)
      .then(({ data }) => setCurrentPatient(data))
      .catch((error) => {
        setError('Error: ' + error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    let mounted = true
    if (mounted) {
      fetchAll()
    }
    return () => (mounted = false)
  }, [])

  const HEADER_HEIGHT = Platform.OS === 'android' ? 260 : 250

  let translateY = animatedValue.interpolate({
    inputRange: [0, 30 + HEADER_HEIGHT],
    outputRange: [0, -194 + HEADER_HEIGHT],
    extrapolate: 'clamp',
  })

  const pressHandler = () => {
    if (currentPatient) {
      navigation.navigate('ToothFormula', {
        userId: currentPatient.id,
        appointments: currentPatient.appointments,
      })
    }
  }

  if (isLoading) {
    return <ActivityIndicator style={{ paddingTop: 20 }} size='large' color='#2A86FF' />
  }

  if (error) {
    return <Text style={label}>{error}</Text>
  }

  return (
    <Container>
      <Animated.FlatList
        data={appointments ? appointments : null}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
          useNativeDriver: true,
        })}
        style={{
          paddingHorizontal: 20,
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => (
          <AppointmentCard
            key={item.id}
            style={{
              shadowColor: 'gray',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <AppointmentCardRow>
              <MaterialCommunityIcons
                style={{ marginRight: 7 }}
                name='calendar-outline'
                size={20}
                color='#A3A3A3'
              />
              <AppointmentCardLabel>
                Date: <Bold>{item.date}</Bold>
              </AppointmentCardLabel>
            </AppointmentCardRow>

            <AppointmentCardRow>
              <MaterialCommunityIcons
                style={{ marginRight: 7 }}
                name='calendar-clock'
                size={20}
                color='#A3A3A3'
              />
              <AppointmentCardLabel>
                Duration:
                <Bold>
                  {item.startTime.slice(0, 5)} - {item.endTime.slice(0, 5)}
                </Bold>
              </AppointmentCardLabel>
            </AppointmentCardRow>

            {!!item.assignedCustomerId && (
              <AppointmentCardRow>
                <Ionicons
                  style={{ marginRight: 7 }}
                  name='ios-person-circle-outline'
                  size={20}
                  color='#A3A3A3'
                />
                <AppointmentCardLabel>
                  Doctor:{' '}
                  <Bold>
                    {clinicUsers
                      .filter((user) => user.id === item.assignedCustomerId)
                      .map((user) => user.fullName)}
                  </Bold>
                </AppointmentCardLabel>
              </AppointmentCardRow>
            )}

            {!!item.clinicSectionId && (
              <AppointmentCardRow>
                <Ionicons style={{ marginRight: 7 }} name='ios-enter' size={20} color='#A3A3A3' />
                <AppointmentCardLabel>
                  Room:{' '}
                  <Bold>
                    {clinicSections
                      .filter((section) => section.id === item.clinicSectionId)
                      .map((section) => section.name)}
                  </Bold>
                </AppointmentCardLabel>
              </AppointmentCardRow>
            )}

            {!!item.note && (
              <AppointmentCardRow>
                <Ionicons style={{ marginRight: 7 }} name='md-document' size={20} color='#A3A3A3' />
                <AppointmentCardLabel>
                  Note: <Bold>{item.note}</Bold>
                </AppointmentCardLabel>
              </AppointmentCardRow>
            )}

            {!!item.status && (
              <AppointmentCardRow>
                <ButtonsWrapper style={{ flex: 1 }}>
                  <Badge color='green' style={{ fontWeight: 'bold' }}>
                    {item.status}
                  </Badge>
                </ButtonsWrapper>
              </AppointmentCardRow>
            )}
          </AppointmentCard>
        )}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchPatientsAppointments} />
        }
        ListHeaderComponent={() => (
          <Animated.View
            style={[
              {
                height: HEADER_HEIGHT,
              },
              {
                transform: [{ translateY }],
              },
            ]}
          >
            <PatientFullName>{currentPatient?.person?.fullName}</PatientFullName>
            <GrayText style={{ marginBottom: 10 }}>
              Total invoiced: {currentPatient?.statsInvoices?.totalInvoiced}
            </GrayText>
            <GrayText style={{ marginBottom: 10 }}>
              Total debts: {currentPatient?.statsInvoices?.totalDebts}
            </GrayText>
            <GrayText style={{ marginBottom: 10 }}>Phone: {currentPatient?.person?.phone}</GrayText>
            <GrayText style={{ marginBottom: 10 }}>
              Birth date: {currentPatient?.person?.birthday}
            </GrayText>
            <ButtonsWrapper>
              <Button onPress={pressHandler}>Dent formula</Button>
              <CallButton onPress={() => Linking.openURL('tel:' + currentPatient?.person?.phone)}>
                <Foundation
                  style={{ marginTop: Platform.OS === 'ios' ? 2 : 0 }}
                  name='telephone'
                  size={30}
                  color='white'
                />
              </CallButton>
            </ButtonsWrapper>

            <AnimatedGrayText
              style={{
                color: '#000',
                fontSize: 20,
                fontWeight: 'bold',
                backgroundColor: '#f8fafd',
                paddingTop: 6,
                alignSelf: 'center',
              }}
            >
              {isLoading === false
                ? appointments.length > 0
                  ? `Приемы (${appointments.length})`
                  : `У пациента ${currentPatient?.person?.fullName} ещё нет приемов`
                : null}
            </AnimatedGrayText>
          </Animated.View>
        )}
      />
    </Container>
  )
}

const AppointmentCardRow = styled.View({
  flexDirection: 'row',
  marginBottom: 7.5,
  marginTop: 7.5,
})

const Bold = styled.Text({
  color: '#000',
  fontSize: 16,
  fontWeight: 'bold',
})

const AppointmentCardLabel = styled.Text({
  color: '#000',
  fontSize: 16,
  flex: 1,
  flexWrap: 'wrap',
})

const AppointmentCard = styled.View({
  backgroundColor: '#fff',
  borderRadius: 10,
  paddingTop: 14,
  paddingBottom: 14,
  paddingLeft: 15,
  paddingRight: 15,
  marginBottom: 20,
})

const Container = styled.SafeAreaView({
  flex: 1,
  backgroundColor: '#f8fafd',
})

const PatientFullName = styled.Text({
  marginTop: 10,
  fontWeight: 'bold',
  fontSize: 20,
  marginBottom: 7,
})

const ButtonsWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const CallButton = styled.TouchableOpacity({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '45px',
  width: '45px',
  height: '45px',
  backgroundColor: '#84D269',
  marginLeft: 10,
})

const label = {
  marginTop: 20,
  fontSize: 16,
  color: '#484848',
  textAlign: 'center',
  fontFamily: 'Roboto',
}

export default PatientScreen
