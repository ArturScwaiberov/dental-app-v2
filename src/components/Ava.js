import React from 'react'
import styled from 'styled-components/native'
import { getAvatarColor } from '../../utils'

const Ava = ({ item }) => {
  if (item.person.photoLink) {
    return <Avatar source={{ uri: item.person.photoLink }} />
  } else {
    const firstLetter = item.person.fullName[0].toUpperCase()
    const avatarColors = getAvatarColor(firstLetter)
    return (
      <FirstLetterHandler style={{ backgroundColor: avatarColors.background }}>
        <FirstLetter style={{ color: avatarColors.color }}>{firstLetter}</FirstLetter>
      </FirstLetterHandler>
    )
  }
}

const FirstLetter = styled.Text({
  fontSize: '24px',
  lineHeight: '30px',
  fontWeight: 'bold',
})

const FirstLetterHandler = styled.View({
  borderRadius: '50px',
  height: '50px',
  width: '50px',
  marginRight: '15px',
  justifyContent: 'center',
  alignItems: 'center',
})

const Avatar = styled.Image({
  borderRadius: '50px',
  height: '50px',
  width: '50px',
  marginRight: '15px',
})

export default Ava
