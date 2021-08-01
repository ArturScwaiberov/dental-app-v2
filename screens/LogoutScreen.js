import React from 'react'
import { Button, Icon, Text, Container, Content, View, Thumbnail } from 'native-base'
import { ActivityIndicator, Linking } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'

import * as authAction from '../store/actions/auth'
import styled from 'styled-components'

const HoursList = ({ hours }) => {
  const hoursArr = []
  for (const key in hours) {
    if (Object.hasOwnProperty.call(hours, key)) {
      const element = hours[key]
      hoursArr.push(
        <Text key={key} style={{ padding: 2 }}>
          {key[0].toUpperCase() + key.slice(1)}: {element.from} - {element.to}
        </Text>
      )
    }
  }
  return hoursArr.map((item) => {
    return item
  })
}

const SectionsList = ({ sections }) => {
  const sectionsArr = []
  for (const key in sections) {
    if (Object.hasOwnProperty.call(sections, key)) {
      const element = sections[key]
      sectionsArr.push(
        <Text key={key} style={{ padding: 2 }}>
          {element.name}
        </Text>
      )
    }
  }

  return sectionsArr.map((item) => {
    return item
  })
}

const UsersList = ({ clinicUsers }) => {
  const usersArr = []
  for (let index = 0; index < clinicUsers.length; index++) {
    const element = clinicUsers[index]
    usersArr.push(
      <View
        key={index}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <Text>
          {element.fullName} {element.isAssistant && '(Assistant),'}{' '}
          {element.isDentist && '(Dentist)'}{' '}
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
          }}
          onPress={() => Linking.openURL('tel:' + element.phone)}
        >
          {element.phone}
        </Text>
      </View>
    )
  }

  return usersArr.map((item) => {
    return item
  })
}

function LogoutScreen() {
  const common = useSelector((state) => state.common)
  const clinicHours = common.clinic.operatingHours
  const clinicName = common.clinic.name
  const clinicPhone = common.clinic.phone
  const clinicEmail = common.clinic.email
  const clinicUsers = common.users
  const clinicSections = common.sections.sort(function (a, b) {
    if (a.name > b.name) {
      return 1
    }
    if (a.name < b.name) {
      return -1
    }
    return 0
  })

  const dispatch = useDispatch()

  const signOut = () => {
    dispatch(authAction.logout())
  }
  return (
    <Container>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Thumbnail
          source={require('../src/images/dent_example_logo.jpg')}
          style={{ height: 100, width: 100, resizeMode: 'cover' }}
        />
        {clinicName && (
          <Text
            style={{
              flex: 1,
              alignSelf: 'center',
              fontSize: 22,
              fontFamily: 'Roboto',
              paddingLeft: 8,
            }}
          >
            {clinicName}
          </Text>
        )}
        {clinicEmail && (
          <CallButton onPress={() => Linking.openURL('mailto:' + clinicEmail)}>
            <Ionicons
              style={{ marginTop: Platform.OS === 'ios' ? 2 : 0 }}
              name='mail'
              size={22}
              color='white'
            />
          </CallButton>
        )}
        {clinicPhone && (
          <CallButton onPress={() => Linking.openURL('tel:' + clinicPhone)}>
            <Ionicons
              style={{ marginTop: Platform.OS === 'ios' ? 2 : 0 }}
              name='call'
              size={22}
              color='white'
            />
          </CallButton>
        )}
      </View>
      {clinicHours && clinicPhone ? (
        <Content style={{ paddingLeft: 20, paddingRight: 20 }}>
          {clinicUsers && (
            <View style={{ paddingVertical: 8 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Clinic Doctors:</Text>
              <UsersList clinicUsers={clinicUsers} />
            </View>
          )}

          {clinicHours && (
            <View style={{ paddingVertical: 8 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Operating hours:</Text>
              <HoursList hours={clinicHours} />
            </View>
          )}

          {clinicSections && (
            <View style={{ paddingVertical: 8 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Clinic sections:</Text>
              <SectionsList sections={clinicSections} />
            </View>
          )}

          <Button
            onPress={() => signOut()}
            block
            success
            style={{ backgroundColor: '#ccc', marginVertical: 10 }}
          >
            <Text style={{ color: '#222' }}>End session and logout</Text>
            <Icon type='MaterialIcons' name='logout' style={{ color: '#222' }} />
          </Button>
        </Content>
      ) : (
        <ActivityIndicator style={{ paddingTop: 20 }} size='large' color='#2A86FF' />
      )}
    </Container>
  )
}
const CallButton = styled.TouchableOpacity({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '45px',
  width: '45px',
  height: '45px',
  backgroundColor: '#84D269',
  marginRight: 5,
  marginLeft: 5,
})

export default LogoutScreen
