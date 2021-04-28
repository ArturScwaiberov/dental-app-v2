import React from 'react'
import styled from 'styled-components/native'

import { getAvatarColor } from '../../utils'
import Avatar from './Avatar'
import GrayText from './GrayText'
import FirstLetter from './FirstLetter'
import FirstLetterHandler from './FirstLetterHandler'
import { useNavigation } from '@react-navigation/core'

const Appointment = ({ item, index }) => {
  const { endTime, startTime } = item
  const currentPatient = item.data.patient?.person
  const navigation = useNavigation()

  const pressHandler = () => {
    currentPatient && item.data.patientId
      ? navigation.navigate('Patient', {
          item: currentPatient.id,
          patientId: item.data.patientId,
        })
      : null
  }

  const Ava = () => {
    if (currentPatient) {
      if (currentPatient?.photoLink) {
        return <Avatar source={{ uri: currentPatient.photoLink }} />
      } else {
        const firstLetter = currentPatient?.fullName[0].toUpperCase() || ''
        const avatarColors = getAvatarColor(firstLetter)
        return (
          <FirstLetterHandler style={{ backgroundColor: avatarColors.background }}>
            <FirstLetter style={{ color: avatarColors.color }}>{firstLetter}</FirstLetter>
          </FirstLetterHandler>
        )
      }
    } else {
      return (
        <FirstLetterHandler style={{ backgroundColor: '#eee' }}>
          <FirstLetter style={{ color: '#888' }}>?</FirstLetter>
        </FirstLetterHandler>
      )
    }
  }

  return (
    <GroupItem onPress={() => pressHandler()}>
      <Ava />
      <GroupDesc>
        <FullName>{currentPatient ? currentPatient.fullName : 'No patient accepted'}</FullName>
        <GrayText>{item.data.note}</GrayText>
      </GroupDesc>
      <GroupTime active={index === 0 ? true : false}>
        <TimeText active={index === 0 ? true : false}>
          {startTime.slice(0, 5)} - {endTime.slice(0, 5)}
        </TimeText>
      </GroupTime>
    </GroupItem>
  )
}

const TimeText = styled.Text`
  color: ${(props) => (props.active ? '#FFF' : '#4294FF')};
  font-size: 14px;
  font-weight: 600;
`

const GroupTime = styled.View`
  background: ${(props) => (props.active ? '#2A86FF' : '#E9F5FF')};
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  padding-horizontal: 6px;
  padding-vertical: 6px;
`

const GroupDesc = styled.View({
  flex: 1,
})

const FullName = styled.Text({
  fontSize: '16px',
  fontWeight: 600,
})

const GroupItem = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: '20px',
  paddingTop: '20px',
  borderBottomWidth: '1px',
  borderBottomColor: '#F3F3F3',
})

export default Appointment
