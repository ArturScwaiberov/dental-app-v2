import React from 'react'
import { Button, Icon, Text, Container, Content, View } from 'native-base'
import { ActivityIndicator, Linking } from 'react-native'
import { useSelector,useDispatch } from 'react-redux'

import * as authAction from '../store/actions/auth'

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
          marginVertical: 5,
        }}
      >
        <Text style={{ fontSize: 18 }}>
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
  const clinicUsers = common.users
  const clinicSections = common.sections
  const dispatch = useDispatch()

  const signOut = () => {
    dispatch(authAction.logout())
  }
  return (
    <Container style={{}}>
      {clinicHours && clinicPhone ? (
        <Content style={{ paddingLeft: 20, paddingRight: 20 }}>
          {clinicName && (
            <Text
              style={{
                paddingTop: 8,
                alignSelf: 'center',
                fontSize: 20,
                fontFamily: 'Roboto',
              }}
            >
              {clinicName}
            </Text>
          )}
          {clinicPhone && (
            <Button
              onPress={() => Linking.openURL('tel:' + clinicPhone)}
              rounded
              block
              style={{ backgroundColor: '#84D269', marginTop: 10 }}
            >
              <Text style={{ color: '#fff' }}>Call to clinic</Text>
              <Icon type='MaterialIcons' name='call' style={{ color: '#fff' }} />
            </Button>
          )}

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
            rounded
            block
            style={{ backgroundColor: '#ccc', marginBottom: 10 }}
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

export default LogoutScreen
