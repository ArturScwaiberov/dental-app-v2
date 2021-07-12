import React from 'react'
import { Animated, Platform, RefreshControl, Linking, Text, View, Pressable } from 'react-native'
import {
  Foundation,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
  MaterialIcons,
} from '@expo/vector-icons'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { GrayText, Button, Badge } from '../src/components'
import { appointmentsApi } from '../utils'
import Modal from 'react-native-modal'
import * as dateFns from 'date-fns'

import * as patientsActions from '../store/actions/patients'
import * as notesActions from '../store/actions/notes'
import { Input, Item } from 'native-base'

const PatientScreen = ({ route, navigation }) => {
  const { patientId } = route.params
  const [appointments, setAppointments] = React.useState([]).sort(function (a, b) {
    return new Date(`${b.date} ${b.startTime}`) - new Date(`${a.date} ${a.startTime}`)
  })
  const [animatedValue, setAnimatedValue] = React.useState(new Animated.Value(0))
  const AnimatedGrayText = Animated.createAnimatedComponent(GrayText)
  const token = useSelector((state) => state.auth.token)
  const common = useSelector((state) => state.common)
  const isLoadingPatients = useSelector((state) => {
    console.log('hey')
    return state.patients.loading;
  })
  const currentPatient = useSelector((state) => state.patients.currentPatient)
  
  const notes = useSelector((state) => state.notes.notes).sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
  const isLoadingNotes = useSelector((state) => state.notes.loading)
  const clinicUsers = common.users
  const clinicSections = common.sections
  const [error, setError] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('appointments')
  const [modalVisible, setModalVisible] = React.useState(false)
  const dispatch = useDispatch()
  const [note, setNote] = React.useState('')
  const isLoading = isLoadingPatients && isLoadingNotes
  const [noteIsLoading, setNoteIsLoading] = React.useState(false)

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
    fetchPatientsAppointments()

    await dispatch(patientsActions.getPatient(token, patientId))
    await dispatch(notesActions.getNotes(token, patientId))
  }

  React.useEffect(() => {
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

  const createHoteHandler = async () => {
    setNoteIsLoading(true)
    await dispatch(notesActions.addNote(token, patientId, note))
    setNoteIsLoading(false)
    setNote('')
    setModalVisible(false)
  }

  const closeModalHandler = () => {
    setNote('')
    setModalVisible(false)
  }

  if (error) {
    return <Text style={label}>{error}</Text>
  }

  const ListHeaderContent = () => {
    return (
      <HeaderContentRow>
        <Pressable
          style={activeTab === 'appointments' ? activeTabStyle : null}
          onPress={() => setActiveTab('appointments')}
        >
          <AnimatedGrayText
            style={activeTab === 'appointments' ? headerBoldTextStyle : headerTextStyle}
          >
            Appointments
          </AnimatedGrayText>
        </Pressable>
        <Pressable
          style={activeTab === 'notes' ? activeTabStyle : null}
          onPress={() => setActiveTab('notes')}
        >
          <AnimatedGrayText style={activeTab === 'notes' ? headerBoldTextStyle : headerTextStyle}>
            Notes
          </AnimatedGrayText>
        </Pressable>
        <Pressable
          style={activeTab === 'invoices' ? activeTabStyle : null}
          onPress={() => setActiveTab('invoices')}
        >
          <AnimatedGrayText
            style={activeTab === 'invoices' ? headerBoldTextStyle : headerTextStyle}
          >
            Invoices
          </AnimatedGrayText>
        </Pressable>
      </HeaderContentRow>
    )
  }

  return (
    <Container>
      <Modal
        animationIn='fadeIn'
        animationOut='fadeOut'
        hideModalContentWhileAnimating={true}
        useNativeDriverForBackdrop={true}
        useNativeDriver={true}
        isVisible={modalVisible}
        onBackdropPress={closeModalHandler}
        onRequestClose={closeModalHandler}
        backdropOpacity={0.4}
      >
        <ModalContainer>
          <ModalView>
            <Item style={{ marginBottom: 10 }}>
              <Input
                onChange={(e) => {
                  setNote(e.nativeEvent.text)
                }}
                value={note}
                multiline
                numberOfLines={5}
                autoFocus
                clearButtonMode='while-editing'
                placeholder='Type note here..'
                placeholderTextColor='#ccc'
                style={{
                  fontSize: 16,
                  paddingVertical: 10,
                  paddingLeft: 7,
                  fontFamily: 'Roboto',
                  color: '#222',
                }}
              />
            </Item>
            <ButtonsWrapper>
              <Pressable style={closeModalButton} onPress={closeModalHandler}>
                <Text style={cancelNoteText}>Cancel</Text>
              </Pressable>
              {!noteIsLoading && note.length > 0 && (
                <Pressable style={createNoteButton} onPress={createHoteHandler}>
                  <Text style={createNoteText}>Create note</Text>
                </Pressable>
              )}
            </ButtonsWrapper>
          </ModalView>
        </ModalContainer>
      </Modal>
      <Animated.FlatList
        data={activeTab === 'appointments' ? appointments : activeTab === 'notes' ? notes : []}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
          useNativeDriver: true,
        })}
        style={{
          paddingHorizontal: 20,
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => {
          if (activeTab === 'appointments') {
            return (
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
                    <Ionicons
                      style={{ marginRight: 7 }}
                      name='ios-enter'
                      size={20}
                      color='#A3A3A3'
                    />
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
            )
          } else if (activeTab === 'notes') {
            return (
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
                    Created at:{' '}
                    <Bold>{dateFns.format(new Date(item.createdAt), 'yyyy-MM-dd, HH:mm')}</Bold>
                  </AppointmentCardLabel>
                </AppointmentCardRow>

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
                        .filter((user) => user.id === item.createdBy)
                        .map((user) => user.fullName)}
                    </Bold>
                  </AppointmentCardLabel>
                </AppointmentCardRow>

                <AppointmentCardRow>
                  <Ionicons
                    style={{ marginRight: 7 }}
                    name='md-document'
                    size={20}
                    color='#A3A3A3'
                  />
                  <AppointmentCardLabel>
                    Note: <Bold>{item.data}</Bold>
                  </AppointmentCardLabel>
                </AppointmentCardRow>
              </AppointmentCard>
            )
          }
        }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchAll} />}
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
            <GrayText style={{ marginBottom: 8 }}>
              Total invoiced: {currentPatient?.statsInvoices?.totalInvoiced}
            </GrayText>
            <GrayText style={{ marginBottom: 8 }}>
              Total debts: {currentPatient?.statsInvoices?.totalDebts}
            </GrayText>
            <GrayText style={{ marginBottom: 8 }}>Phone: {currentPatient?.person?.phone}</GrayText>
            <GrayText style={{ marginBottom: 12 }}>
              Birth date: {currentPatient?.person?.birthday}
            </GrayText>
            <ButtonsWrapper>
              <ToothButton onPress={pressHandler}>
                <FontAwesome5 name='tooth' size={28} color='white' />
              </ToothButton>
              <MoneyButton onPress={pressHandler}>
                <MaterialIcons name='monetization-on' size={28} color='white' />
              </MoneyButton>
              <InvoiceButton onPress={() => setModalVisible(true)}>
                <Ionicons name='ios-card' size={28} color='white' />
              </InvoiceButton>
              <NoteButton onPress={() => setModalVisible(true)}>
                <Ionicons
                  style={{ paddingLeft: 3.5 }}
                  name='ios-create-outline'
                  size={28}
                  color='white'
                />
              </NoteButton>
              <CallButton onPress={() => Linking.openURL('tel:' + currentPatient?.person?.phone)}>
                <Foundation
                  style={{ marginTop: Platform.OS === 'ios' ? 2 : 0 }}
                  name='telephone'
                  size={30}
                  color='white'
                />
              </CallButton>
            </ButtonsWrapper>

            <ListHeaderHolder>
              {appointments.length > 0 ? (
                <ListHeaderContent />
              ) : (
                <AnimatedGrayText>{`Patient ${currentPatient?.person?.fullName} have no appointments yet`}</AnimatedGrayText>
              )}
            </ListHeaderHolder>
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

const HeaderContentRow = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  flex: 1,
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

const ModalContainer = styled.View({
  flex: 1,
})

const ModalView = styled.View({
  marginTop: '30%',
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 15,
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

const ListHeaderHolder = styled.TouchableOpacity({
  flex: 1,
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

const InvoiceButton = styled.TouchableOpacity({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '45px',
  width: '45px',
  height: '45px',
  backgroundColor: '#f87300',
  marginLeft: 10,
})

const MoneyButton = styled.TouchableOpacity({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '45px',
  width: '45px',
  height: '45px',
  backgroundColor: '#84D269',
  marginLeft: 10,
})

const ToothButton = styled.TouchableOpacity({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '45px',
  width: '45px',
  height: '45px',
  backgroundColor: '#2A86FF',
  marginLeft: 10,
})

const NoteButton = styled.TouchableOpacity({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '45px',
  width: '45px',
  height: '45px',
  backgroundColor: '#fccd4a',
  marginLeft: 10,
})

const label = {
  marginTop: 20,
  fontSize: 16,
  color: '#484848',
  textAlign: 'center',
  fontFamily: 'Roboto',
}

const headerTextStyle = {
  color: '#000',
  fontSize: 18,
}

const headerBoldTextStyle = {
  color: '#000',
  fontSize: 18,
  fontWeight: 'bold',
}

const activeTabStyle = { borderBottomColor: '#ccc', borderBottomWidth: 1 }

const createNoteButton = {
  borderRadius: 20,
  padding: 10,
  backgroundColor: '#84D269',
}

const createNoteText = {
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'center',
}

const closeModalButton = {
  borderRadius: 20,
  padding: 10,
}

const cancelNoteText = {
  color: '#FF6347',
  textAlign: 'center',
}

export default PatientScreen
