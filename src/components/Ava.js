import React from 'react'

import { getAvatarColor } from '../../utils'
import Avatar from './Avatar'
import FirstLetter from './FirstLetter'
import FirstLetterHandler from './FirstLetterHandler'

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

export default Ava
