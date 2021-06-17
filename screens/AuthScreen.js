import React from 'react'
import { Container, Content, Text, Thumbnail } from 'native-base'

const AuthScreen = () => {
  return (
    <Container>
      <Content style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20, flex: 1 }}>
        <Thumbnail
          source={require('../src/images/dent_example_logo.jpg')}
          style={{ height: 200, width: null, flex: 1 }}
        />
        <Text
          style={{
            paddingTop: 50,
            fontSize: 16,
            color: '#111',
            textAlign: 'center',
            fontFamily: 'Roboto',
          }}
        >
          Contact with clinic manager for registration
        </Text>
      </Content>
    </Container>
  )
}

export default AuthScreen
