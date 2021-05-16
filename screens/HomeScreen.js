import React from 'react'
import { useFocusEffect, useScrollToTop } from '@react-navigation/native'
import { SectionList, RefreshControl, BackHandler } from 'react-native'
import styled from 'styled-components/native'
import { useSelector } from 'react-redux'

import { appointmentsApi } from '../utils/api'
import { Appointment, SectionTitle } from '../src/components'
import { addMonths, format } from 'date-fns'

const HomeScreen = ({navigation}) => {
  const [data, setData] = React.useState([])
  const [refreshing, setRefreshing] = React.useState(false)
  const token = useSelector((state) => state.auth.token)
  const ref = React.useRef(null)

  React.useEffect(()=>{
    const backAction = () => navigation.navigate('AppointmentsCalendarTab')

    const backHandler = BackHandler.addEventListener('hardwareBackPress',backAction)

    return ()=>backHandler.remove()
  },[])

  useFocusEffect(
    React.useCallback(() => {
      cleanFetch()
    }, [])
  )

  useScrollToTop(ref)

  const groupArr = (arr) => {
    const newArr = []

    for (const key in arr) {
      if (Object.hasOwnProperty.call(arr, key)) {
        const element = {
          date: arr[key].date,
          startTime: arr[key].startTime,
          endTime: arr[key].endTime,
          patientId: arr[key].patientId,
          data: arr[key],
        }
        newArr.push(element)
      }
    }

    const obj = newArr.reduce((acc, cur) => {
      if (!acc[cur.date]) {
        acc[cur.date] = []
      }
      acc[cur.date].push(cur)
      return acc
    }, {})
    return Object.keys(obj)
      .map((date) => {
        return {
          date,
          data: obj[date],
        }
      })
      .sort((a, b) => (a.date > b.date ? 1 : -1))
  }

  const cleanFetch = () => {
    const today = new Date()
    const startDate = format(today, 'yyyy-MM-dd')
    const endDate = format(addMonths(today, 1), 'yyyy-MM-dd')

    appointmentsApi
      .getAll(token, startDate, endDate)
      .then(({ data }) => {
        setData(groupArr(data))
      })
      .catch((error) => {
        console.log('Error', error.message)
      })
      .finally((resp) => {
        setRefreshing(false)
      })
  }

  const fetchAppointments = () => {
    setRefreshing(true)
    cleanFetch()
  }

  React.useEffect(fetchAppointments, [])

  const listEmptyComponent = () => {
    return (
      refreshing === false && (
        <ActionText style={{ color: '#816CFF' }}>Нет запланированных приемов.. 💁‍♀️</ActionText>
      )
    )
  }

  return (
    <Container>
      <SectionList
        ref={ref}
        style={{ paddingLeft: 20, paddingRight: 20 }}
        sections={data ? data : null}
        keyExtractor={(item) => item.data.id}
        renderItem={({ item, index }) => <Appointment item={item} index={index} />}
        renderSectionHeader={({ section }) =>
          section.data.length > 0 && <SectionTitle>{section.date}</SectionTitle>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchAppointments} />}
        ListEmptyComponent={() => listEmptyComponent()}
        stickySectionHeadersEnabled={true}
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

export default HomeScreen
