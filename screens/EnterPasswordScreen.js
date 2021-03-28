import React, { useEffect, useState } from 'react'
import { Icon, Text, Button } from 'native-base'
import styled from 'styled-components/native'

const dummyPass = '1235'

const EnterPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState([])
  const [timesPressed, setTimesPressed] = useState(0)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      if (timesPressed > 0) {
        if (timesPressed >= 4) {
          const stringPass = password.join('')
          if (stringPass === dummyPass) {
            navigation.navigate('EnterHome')
          } else {
            setTimeout(() => {
              setPassword([])
              setTimesPressed(0)
              setShowError(true)
            }, 300)
          }
          setPassword([])
          setTimesPressed(0)
        }
      }
    }
    return () => {
      cleanup = false
    }
  })

  const pushHandler = (num) => {
    setShowError(false)
    setPassword((current) => [...current, num])
    setTimesPressed((current) => current + 1)
  }

  return (
    <ContentHolder>
      {showError ? (
        <Text style={{ textAlign: 'center', color: 'tomato' }}>Код доступа введен не верно</Text>
      ) : (
        <Text style={{ textAlign: 'center' }}>Установите код доступа</Text>
      )}
      <RoundsView>
        <RoundItem style={timesPressed >= 1 ? RoundItemFilled : null} />
        <RoundItem style={timesPressed >= 2 ? RoundItemFilled : null} />
        <RoundItem style={timesPressed >= 3 ? RoundItemFilled : null} />
        <RoundItem style={timesPressed > 3 ? RoundItemFilled : null} />
      </RoundsView>
      <PinHolder>
        <ButtonView>
          <Button
            onPress={() => {
              pushHandler(1)
            }}
            rounded
            style={buttonsHolder}
          >
            <Text style={numberHolder}>1</Text>
          </Button>
          <Button
            onPress={() => {
              pushHandler(2)
            }}
            rounded
            style={buttonsHolder}
          >
            <Text style={numberHolder}>2</Text>
          </Button>
          <Button
            onPress={() => {
              pushHandler(3)
            }}
            rounded
            style={buttonsHolder}
          >
            <Text style={numberHolder}>3</Text>
          </Button>
        </ButtonView>
        <ButtonView>
          <Button
            onPress={() => {
              pushHandler(4)
            }}
            rounded
            style={buttonsHolder}
          >
            <Text style={numberHolder}>4</Text>
          </Button>
          <Button
            onPress={() => {
              pushHandler(5)
            }}
            rounded
            style={buttonsHolder}
          >
            <Text style={numberHolder}>5</Text>
          </Button>
          <Button
            onPress={() => {
              pushHandler(6)
            }}
            rounded
            style={buttonsHolder}
          >
            <Text style={numberHolder}>6</Text>
          </Button>
        </ButtonView>
        <ButtonView>
          <Button
            onPress={() => {
              pushHandler(7)
            }}
            rounded
            style={buttonsHolder}
          >
            <Text style={numberHolder}>7</Text>
          </Button>
          <Button
            onPress={() => {
              pushHandler(8)
            }}
            rounded
            style={buttonsHolder}
          >
            <Text style={numberHolder}>8</Text>
          </Button>
          <Button
            onPress={() => {
              pushHandler(9)
            }}
            rounded
            style={buttonsHolder}
          >
            <Text style={numberHolder}>9</Text>
          </Button>
        </ButtonView>
        <ButtonView>
          <Button onPress={() => {}} rounded style={buttonsHolderEmpty}>
            <Text style={textHolder}>забыли?</Text>
          </Button>
          <Button
            onPress={() => {
              pushHandler(0)
            }}
            rounded
            style={buttonsHolder}
          >
            <Text style={numberHolder}>0</Text>
          </Button>
          <Button onPress={() => {}} rounded style={buttonsHolderEmpty}>
            <Icon
              type='MaterialIcons'
              name='backspace'
              style={{
                color: '#ff695e',
                fontSize: 20,
              }}
            />
          </Button>
        </ButtonView>
      </PinHolder>
    </ContentHolder>
  )
}

const ContentHolder = styled.View({
  alignItems: 'center',
  backgroundColor: '#fff',
  flex: 1,
  paddingTop: 20,
})

const RoundsView = styled.View({
  width: '50%',
  paddingTop: 25,
  justifyContent: 'space-around',
  flexDirection: 'row',
})

const RoundItem = styled.View({
  height: 14,
  width: 14,
  borderColor: '#777',
  borderWidth: 1,
  borderRadius: 14,
})

const RoundItemFilled = {
  height: 14,
  width: 14,
  borderRadius: 14,
  backgroundColor: '#555',
}

const PinHolder = styled.View({
  justifyContent: 'center',
  flex: 1,
  paddingLeft: 15,
  paddingRight: 15,
})

const ButtonView = styled.View({
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',
})

const buttonsHolder = {
  width: 70,
  height: 70,
  margin: 15,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f5f5f5',
  borderColor: '#aaa',
  borderWidth: 1,
  elevation: 0,
}

const buttonsHolderEmpty = {
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
  flex: 1,
  width: 90,
  elevation: 0,
}

const numberHolder = {
  fontSize: 22,
  color: '#2e661b',
  fontWeight: 'bold',
}
const textHolder = {
  fontSize: 14,
  color: '#2e661b',
  fontFamily: 'Roboto',
}

export default EnterPasswordScreen
