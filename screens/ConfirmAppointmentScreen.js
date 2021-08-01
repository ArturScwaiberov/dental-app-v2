import React from 'react'
import {
  Container,
  Content,
  Icon,
  Text,
  Button,
  Form,
  Textarea,
  Segment,
  Label,
  View,
  Item,
  Input,
} from 'native-base'
import { useSelector } from 'react-redux'
import { ActivityIndicator } from 'react-native'
import { TextInputMask } from 'react-native-masked-input'

import ModalPicker from '../src/components/ModalPicker'
import { appointmentsApi, patientsApi } from '../utils'

const ConfirmAppointmentScreen = ({ navigation, route }) => {
  const { date, startTime, endTime, clinicSectionIds, customerIds } = route.params

  const [error, setError] = React.useState('')
  const [active, setActive] = React.useState('first')
  const [loading, setLoading] = React.useState(false)
  const token = useSelector((state) => state.auth.token)
  const { patients } = useSelector((state) => state.patients)
  const sectionsList = useSelector((state) => state.common.sections)
    .filter((section) => clinicSectionIds.includes(section.id))
    .sort(function (a, b) {
      if (a.name > b.name) {
        return 1
      }
      if (a.name < b.name) {
        return -1
      }
      return 0
    })

  const usersList = useSelector((state) => state.common.users)
    .filter((user) => customerIds.includes(user.id))
    .sort(function (a, b) {
      if (a.fullName > b.fullName) {
        return 1
      }
      if (a.fullName < b.fullName) {
        return -1
      }
      return 0
    })

  const patientsList = patients.sort(function (a, b) {
    if (a.fullName > b.fullName) {
      return 1
    }
    if (a.fullName < b.fullName) {
      return -1
    }
    return 0
  })

  const [selectedPatient, setSelectedPatient] = React.useState('')
  const [selectedUser, setSelectedUser] = React.useState('')
  const [selectedSection, setSelectedSection] = React.useState('')

  const selectSectionHandler = (item) => {
    setSelectedSection(item)
  }

  const selectUserHandler = (item) => {
    setSelectedUser(item)
  }

  const selectPatientHandler = (item) => {
    setSelectedPatient(item)
  }

  const ExistingPatient = () => {
    const [note, setNote] = React.useState('')

    const submitHandler = () => {
      setError('')
      setLoading(true)
      const data = {
        assignedCustomerId: selectedUser,
        patientId: selectedPatient,
        clinicSectionId: selectedSection,
        note: note,
        date,
        startTime,
        endTime,
      }
      appointmentsApi
        .add(token, data, selectedPatient)
        .then(() => {
          navigation.navigate('AppointmentsListTab', { screen: 'AppointmentsList' })
        })
        .catch((err) => {
          setError('ERROR after sending appointment (existing patient)')
        })
        .finally(() => setLoading(false))
    }

    if (loading) {
      return <ActivityIndicator style={{ paddingTop: 20 }} size='large' color='#2A86FF' />
    }

    return (
      <Content padder>
        {error ? (
          <Text style={{ textAlign: 'center', padding: 10, color: 'tomato', fontFamily: 'Roboto' }}>
            {error}
          </Text>
        ) : null}
        <Form>
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                type='FontAwesome5'
                name='door-open'
                style={{
                  fontSize: 18,
                  paddingHorizontal: 10,
                  color: selectedSection === '' ? '#ccc' : '#84D269',
                }}
              />
              <Label>Room</Label>
            </View>
            <ModalPicker
              header={'Select a room'}
              showTitle={'Select a room'}
              items={sectionsList}
              onSelect={selectSectionHandler}
              selected={selectedSection}
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                type='FontAwesome5'
                name='user-md'
                style={{
                  fontSize: 20,
                  paddingLeft: 12,
                  paddingRight: 13,
                  color: selectedUser === '' ? '#ccc' : '#84D269',
                }}
              />
              <Label>Provider</Label>
            </View>
            <ModalPicker
              header={'Select a provider'}
              showTitle={'Select a provider'}
              items={usersList}
              onSelect={selectUserHandler}
              selected={selectedUser}
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                type='FontAwesome5'
                name='user-check'
                style={{
                  fontSize: 18,
                  paddingHorizontal: 10,
                  color: selectedPatient === '' ? '#ccc' : '#84D269',
                }}
              />
              <Label>Patient</Label>
            </View>
            <ModalPicker
              showSearchBar={true}
              header={'Select a patient'}
              showTitle={'Select a patient'}
              items={patientsList}
              onSelect={selectPatientHandler}
              selected={selectedPatient}
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Icon
                type='FontAwesome5'
                name='align-left'
                style={{
                  fontSize: 20,
                  paddingLeft: 12,
                  paddingRight: 13,
                  color: note === '' ? '#ccc' : '#84D269',
                }}
              />
              <Label>Note</Label>
            </View>
            <Textarea
              rowSpan={5}
              bordered
              placeholder='Text your note (optional)'
              onChangeText={(text) => setNote(text)}
              value={note}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Button
              onPress={submitHandler}
              block
              success
              style={{
                backgroundColor:
                  selectedSection && selectedUser && selectedPatient
                    ? '#84D269'
                    : 'rgba(132, 210, 105, 0.5)',
              }}
              disabled={selectedSection && selectedUser && selectedPatient ? false : true}
            >
              <Text style={{ color: '#fff', fontFamily: 'Roboto', fontWeight: 'bold' }}>Save</Text>
              <Icon type='MaterialIcons' name='navigate-next' style={{ color: '#fff' }} />
            </Button>
          </View>
        </Form>
      </Content>
    )
  }

  const NewPatient = () => {
    const [values, setValues] = React.useState({})
    const [note, setNote] = React.useState('')

    const setFieldValue = (name, value) => {
      setValues({
        ...values,
        [name]: value,
      })
    }

    const handleInputChange = (name, e) => {
      const text = e.nativeEvent.text
      setFieldValue(name, text)
    }

    const submitHandler = async () => {
      setError('')
      setLoading(true)

      try {
        const { data } = await patientsApi.add(token, values)
        if (data.error === 'BAD_REQUEST') {
          setError('Please enter valid data')
          setLoading(false)
        } else {
          submitAppointmentHandler(data.id)
        }
      } catch (error) {
        setLoading(false)
      }
    }

    const submitAppointmentHandler = async (incomingPatientId) => {
      const appointmentData = {
        assignedCustomerId: selectedUser,
        clinicSectionId: selectedSection,
        note: note,
        date,
        startTime,
        endTime,
      }

      await appointmentsApi
        .add(token, appointmentData, incomingPatientId)
        .then(() => {
          navigation.navigate('AppointmentsListTab', { screen: 'AppointmentsList' })
        })
        .catch((err) => {
          setError('ERROR after sending appointment (new patient)')
        })
        .finally(() => {
          setLoading(false)
        })
    }

    if (loading) {
      return <ActivityIndicator style={{ paddingTop: 20 }} size='large' color='#2A86FF' />
    }

    return (
      <Content padder>
        {error ? (
          <Text style={{ textAlign: 'center', padding: 10, color: 'tomato', fontFamily: 'Roboto' }}>
            {error}
          </Text>
        ) : null}
        <Form>
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                type='FontAwesome5'
                name='door-open'
                style={{
                  fontSize: 18,
                  paddingHorizontal: 10,
                  color: selectedSection === '' ? '#ccc' : '#84D269',
                }}
              />
              <Label style={{ color: '#222' }}>Room</Label>
            </View>
            <ModalPicker
              header={'Select a room'}
              showTitle={'Select a room'}
              items={sectionsList}
              onSelect={selectSectionHandler}
              selected={selectedSection}
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                type='FontAwesome5'
                name='user-md'
                style={{
                  fontSize: 20,
                  paddingLeft: 12,
                  paddingRight: 13,
                  color: selectedUser === '' ? '#ccc' : '#84D269',
                }}
              />
              <Label style={{ color: '#222' }}>Provider</Label>
            </View>
            <ModalPicker
              header={'Select a provider'}
              showTitle={'Select a provider'}
              items={usersList}
              onSelect={selectUserHandler}
              selected={selectedUser}
            />
          </View>

          <View style={{ paddingHorizontal: 2, borderLeftWidth: 8, borderLeftColor: '#ccc' }}>
            <Item style={{ marginBottom: 10 }}>
              <Input
                onChange={handleInputChange.bind(this, 'fullName')}
                value={values.fullName}
                clearButtonMode='while-editing'
                placeholder='Patients full name'
                placeholderTextColor='#222'
                style={{
                  fontSize: 16,
                  paddingVertical: 10,
                  paddingLeft: 7,
                  fontFamily: 'Roboto',
                  color: '#222',
                }}
              />
            </Item>

            <Item style={{ marginBottom: 10 }}>
              <TextInputMask
                type={'cel-phone'}
                options={{
                  maskType: 'BRL',
                  withDDD: true,
                  dddMask: '+1(999)999-9999',
                }}
                value={values.phone}
                keyboardType='phone-pad'
                placeholder='+1(312)123-4567'
                placeholderTextColor='#222'
                maxLength={15}
                onChangeText={(maskedText) => {
                  setFieldValue('phone', maskedText)
                }}
                style={{
                  fontSize: 16,
                  paddingVertical: 10,
                  paddingLeft: 7,
                  fontFamily: 'Roboto',
                  color: '#222',
                }}
              />
            </Item>

            <Item style={{ marginBottom: 10 }}>
              <TextInputMask
                type={'datetime'}
                options={{
                  format: 'YYYY/MM/DD',
                }}
                value={values.birthday}
                keyboardType='number-pad'
                placeholder='YYYY/MM/DD'
                placeholderTextColor='#222'
                onChangeText={(text) => {
                  setFieldValue('birthday', text)
                }}
                style={{
                  fontSize: 16,
                  paddingVertical: 10,
                  paddingLeft: 7,
                  fontFamily: 'Roboto',
                  color: '#222',
                }}
              />
            </Item>
          </View>

          <View>
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
              <Icon
                type='FontAwesome5'
                name='align-left'
                style={{
                  fontSize: 20,
                  paddingLeft: 12,
                  paddingRight: 13,
                  color: note === '' ? '#ccc' : '#84D269',
                }}
              />
              <Label style={{ color: '#222' }}>Note</Label>
            </View>
            <Textarea
              rowSpan={5}
              bordered
              placeholder='Text your note (optional)'
              onChangeText={(text) => setNote(text)}
              value={note}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Button
              onPress={submitHandler}
              block
              success
              style={{
                backgroundColor:
                  selectedSection &&
                  selectedUser &&
                  values.fullName &&
                  values.phone &&
                  values.birthday
                    ? '#84D269'
                    : 'rgba(132, 210, 105, 0.5)',
              }}
              disabled={
                selectedSection &&
                selectedUser &&
                values.fullName &&
                values.phone &&
                values.birthday
                  ? false
                  : true
              }
            >
              <Text style={{ color: '#fff', fontFamily: 'Roboto', fontWeight: 'bold' }}>Save</Text>
              <Icon type='MaterialIcons' name='navigate-next' style={{ color: '#fff' }} />
            </Button>
          </View>
        </Form>
      </Content>
    )
  }

  const NoPatient = () => {
    const [note, setNote] = React.useState('')

    const submitHandler = () => {
      setLoading(true)
      const data = {
        clinicSectionId: selectedSection,
        note: note,
        date,
        startTime,
        endTime,
      }
      appointmentsApi
        .addNoPatient(token, data)
        .then(() => {
          navigation.navigate('AppointmentsListTab', { screen: 'AppointmentsList' })
        })
        .catch((err) => {
          setError('ERROR after sending appointment (no patient)')
        })
        .finally(() => setLoading(false))
    }

    if (loading) {
      return <ActivityIndicator style={{ paddingTop: 20 }} size='large' color='#2A86FF' />
    }

    return (
      <Content padder>
        {error ? (
          <Text style={{ textAlign: 'center', padding: 10, color: 'tomato', fontFamily: 'Roboto' }}>
            {error}
          </Text>
        ) : null}
        <Form>
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                type='FontAwesome5'
                name='door-open'
                style={{
                  fontSize: 18,
                  paddingHorizontal: 10,
                  color: selectedSection === '' ? '#ccc' : '#84D269',
                }}
              />
              <Label>Room</Label>
            </View>
            <ModalPicker
              header={'Select a room'}
              showTitle={'Select a room'}
              items={sectionsList}
              onSelect={selectSectionHandler}
              selected={selectedSection}
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                type='FontAwesome5'
                name='user-md'
                style={{
                  fontSize: 20,
                  paddingLeft: 12,
                  paddingRight: 13,
                  color: selectedUser === '' ? '#ccc' : '#84D269',
                }}
              />
              <Label>Provider</Label>
            </View>
            <ModalPicker
              header={'Select a provider'}
              showTitle={'Select a provider'}
              items={usersList}
              onSelect={selectUserHandler}
              selected={selectedUser}
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Icon
                type='FontAwesome5'
                name='align-left'
                style={{
                  fontSize: 20,
                  paddingLeft: 12,
                  paddingRight: 13,
                  color: note === '' ? '#ccc' : '#84D269',
                }}
              />
              <Label>Note</Label>
            </View>
            <Textarea
              rowSpan={5}
              bordered
              placeholder='Text your note (optional)'
              onChangeText={(text) => setNote(text)}
              value={note}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Button
              onPress={submitHandler}
              block
              success
              style={{
                backgroundColor:
                  selectedSection && selectedUser ? '#84D269' : 'rgba(132, 210, 105, 0.5)',
              }}
              disabled={selectedSection && selectedUser ? false : true}
            >
              <Text style={{ color: '#fff', fontFamily: 'Roboto', fontWeight: 'bold' }}>Save</Text>
              <Icon type='MaterialIcons' name='navigate-next' style={{ color: '#fff' }} />
            </Button>
          </View>
        </Form>
      </Content>
    )
  }

  return (
    <Container>
      <Segment>
        <Button first onPress={() => setActive('first')} active={active === 'first' ? true : false}>
          <Text>Existing patient</Text>
        </Button>
        <Button onPress={() => setActive('second')} active={active === 'second' ? true : false}>
          <Text>New patient</Text>
        </Button>
        <Button last onPress={() => setActive('third')} active={active === 'third' ? true : false}>
          <Text>No patient</Text>
        </Button>
      </Segment>
      {active === 'first' && <ExistingPatient />}
      {active === 'second' && <NewPatient />}
      {active === 'third' && <NoPatient />}
    </Container>
  )
}

export default ConfirmAppointmentScreen
