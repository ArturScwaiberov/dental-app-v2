import React, { useEffect, useState } from 'react'
import { Animated, Platform, ActivityIndicator, RefreshControl, Linking, Alert } from 'react-native'
import { Foundation, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { GrayText, Button, Badge } from '../src/components'
import { appointmentsApi } from '../utils'

const PatientScreen = ({ route, navigation }) => {
  const { item } = route.params
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0))
  const AnimatedGrayText = Animated.createAnimatedComponent(GrayText)
  const token = useSelector((state) => state.auth.token)

  const fetchPatientsAppointments = () => {
    appointmentsApi
      .get(token, item.id)
      .then(({ data }) => {
        setAppointments(data)
      })
      .catch((error) => {
        console.log('Error', error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    let mounted = true
    if (mounted) {
      fetchPatientsAppointments()
    }
    return () => (mounted = false)
  }, [])

  const BirthDate = () => {
    if (item.person.birthday) {
      return <GrayText style={{ marginBottom: 10 }}>Birth date: {item.person.birthday}</GrayText>
    } else {
      return null
    }
  }

  const HEADER_HEIGHT = Platform.OS === 'android' ? 260 : 250

  let translateY = animatedValue.interpolate({
    inputRange: [0, 30 + HEADER_HEIGHT],
    outputRange: [0, -194 + HEADER_HEIGHT],
    extrapolate: 'clamp',
  })

  const pressHandler = () => {
    navigation.navigate('ToothFormula', { userId: item.id, appointments: appointments })
  }

  return (
    <Container>
      {isLoading ? (
        <ActivityIndicator size='small' />
      ) : (
        <Animated.FlatList
          data={appointments}
          scrollEventThrottle={16} // <-- Use 1 here to make sure no events are ever missed
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: animatedValue } } }],
            { useNativeDriver: true } // <-- Add this
          )}
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
                  Duration:{' '}
                  <Bold>
                    {item.startTime.slice(0, 5)} - {item.endTime.slice(0, 5)}
                  </Bold>
                </AppointmentCardLabel>
              </AppointmentCardRow>

              {item.note && (
                <AppointmentCardRow>
                  <Ionicons
                    style={{ marginRight: 7 }}
                    name='md-document'
                    size={20}
                    color='#A3A3A3'
                  />
                  <AppointmentCardLabel>
                    Note: <Bold>{item.note}</Bold>
                  </AppointmentCardLabel>
                </AppointmentCardRow>
              )}

              {item.status && (
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
              <PatientFullName>{item.person.fullName}</PatientFullName>
              <GrayText style={{ marginBottom: 10 }}>
                Total invoiced: {item.statsInvoices.totalInvoiced}
              </GrayText>
              <GrayText style={{ marginBottom: 10 }}>
                Total debts: {item.statsInvoices.totalDebts}
              </GrayText>
              <GrayText style={{ marginBottom: 10 }}>Phone: {item.person.phone}</GrayText>
              <BirthDate />
              <ButtonsWrapper>
                <Button onPress={pressHandler}>Dent formula</Button>
                <CallButton onPress={() => Linking.openURL('tel:' + item.person.phone)}>
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
                    : `У пациента ${item.person.fullName} ещё нет приемов`
                  : null}
              </AnimatedGrayText>
            </Animated.View>
          )}
        />
      )}
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
  paddingLeft: 20,
  paddingRight: 20,
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

export default PatientScreen
