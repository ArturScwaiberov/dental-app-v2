import React from 'react'
import styled from 'styled-components/native'
import { differenceInYears } from 'date-fns'

import Ava from './Ava'
import GrayText from './GrayText'

const Patient = ({ navigation, item }) => {
  let age
  if (item.person.birthday == null) {
    age = null
  } else {
    age = differenceInYears(new Date(), new Date(item.person.birthday))
  }

  /* console.log('patientId', item.person.id + ' - ' + item.person.fullName) */

  return (
    <GroupItem
      onPress={() =>
        navigation.navigate('Patient', {
          item: item,
          patientId: item.id,
        })
      }
    >
      <Ava item={item} />
      <GroupDesc>
        <FullName>
          {item.person.fullName}, {age}
        </FullName>
        <GrayText>{item.person.phone}</GrayText>
      </GroupDesc>
      <GroupTime>
        <TimeText>{item.person.sex === null ? 'gold' : item.person.sex[0].toUpperCase()}</TimeText>
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
  border-radius: 18px;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 32px;
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
  paddingHorizontal: '20px',
  paddingVertical: '10px',
  borderBottomWidth: '1px',
  borderBottomColor: '#F3F3F3',
})

export default Patient
