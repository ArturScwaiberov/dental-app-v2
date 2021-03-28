import { Button, Icon, Text, Container, Content } from 'native-base'
import React from 'react'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
})

export default function LogoutScreen({ signOut }) {
  return (
    <Container>
      <Content style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}>
        <Text style={styles.text}>You are now authenticated</Text>
        <Button
          onPress={() => signOut()}
          rounded
          block
          /* iconLeft */
          style={{ backgroundColor: '#84D269' }}
        >
          <Text style={{ color: '#fff' }}>Выйти из кабинета</Text>
          <Icon type='MaterialIcons' name='navigate-next' style={{ color: '#fff' }} />
        </Button>
      </Content>
    </Container>
  )
}
