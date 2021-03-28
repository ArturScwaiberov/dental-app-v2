import React from 'react'
import styled from 'styled-components/native'
import { useFocusEffect, useScrollToTop } from '@react-navigation/native'
import { Animated, RefreshControl, Alert } from 'react-native'
import { Header, Item, Input, Icon } from 'native-base'

import { patientsApi } from '../utils'
import { Patient } from '../src/components'
import { useSelector } from 'react-redux'

const PatientsListScreen = ({ navigation }) => {
  const [data, setData] = React.useState([])
  const [searchValue, setSearchValue] = React.useState('')
  const [refreshing, setRefreshing] = React.useState(false)
  const [animatedValue, setAnimatedValue] = React.useState(new Animated.Value(0))
  const ref = React.useRef(null)
  const token = useSelector((state) => state.auth.token)
  /* console.log('data', data) */

  useFocusEffect(
    React.useCallback(() => {
      fetchPatients()
    }, [])
  )

  useScrollToTop(ref)

  const cleanFetch = async () => {
    await patientsApi
      .get(token)
      .then(({ data }) => {
        const tempArr = Array.from(data)
        setData(tempArr[0])
      })
      .catch((error) => {
        console.log('Error', error)
      })
      .finally(() => {
        setRefreshing(false)
      })
  }

  const fetchPatients = () => {
    setRefreshing(true)
    cleanFetch()
  }

  const onSearch = (e) => {
    setSearchValue(e.nativeEvent.text)
  }

  const HEADER_HEIGHT = 60

  let translateY = animatedValue.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.7],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  })

  const listEmptyComponent = () => {
    return (
      refreshing === false && (
        <ActionText style={{ color: '#816CFF', padding: 0 }}>
          Ни одного пациента не найдено... 💁‍♀️
        </ActionText>
      )
    )
  }

  return (
    <Container>
      <Animated.FlatList
        scrollToOverflowEnabled={true}
        ref={ref}
        style={{}}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEventThrottle={16} // <-- Use 1 here to make sure no events are ever missed
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: animatedValue } } }],
          { useNativeDriver: true } // <-- Add this
        )}
        data={
          data
            ? data.filter(
                (item) => item.person.fullName.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
              )
            : null
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <Patient navigation={navigation} item={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPatients} />}
        ListEmptyComponent={() => listEmptyComponent()}
        ListHeaderComponent={
          <Animated.View
            style={[{ height: HEADER_HEIGHT, left: 0, right: 0 }, { transform: [{ translateY }] }]}
          >
            <Header
              searchBar
              rounded
              style={{ paddingTop: 0, height: HEADER_HEIGHT + 1, backgroundColor: '#fff' }}
            >
              <Item style={{ height: 36, borderRadius: 10, backgroundColor: '#eee' }}>
                <Icon name='ios-search' />
                <Input
                  placeholder='Поиск...'
                  clearButtonMode='always'
                  value={searchValue}
                  onChange={(text) => onSearch(text)}
                />
              </Item>
            </Header>
          </Animated.View>
        }
      />
    </Container>
  )
}

const Container = styled.SafeAreaView({
  flex: 1,
  backgroundColor: '#fff',
})

const ActionText = styled.Text({
  color: 'white',
  fontSize: 16,
  backgroundColor: 'transparent',
  padding: 10,
})

export default PatientsListScreen
