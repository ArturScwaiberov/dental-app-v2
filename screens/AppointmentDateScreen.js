import React from 'react'
import { ActivityIndicator } from 'react-native'
import { Container, Content, Spinner } from 'native-base'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'

import { patientsApi } from '../utils'
import Calendar from '../src/components/Calendar'
import * as commonActions from '../store/actions/common'

const AppointmentDateScreen = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = React.useState(false)
  const [data, setData] = React.useState([])
  const token = useSelector((state) => state.auth.token)
  /* const sections = useSelector((state) => state.common.sections) */
  const users = useSelector((state) => state.common.users)
  /* const date = new Date('April 17, 2021 03:24:00') */
  const date = new Date()
  const startMonth = format(startOfMonth(date), 'yyyy-MM-dd')
  const endMonth = format(endOfMonth(date), 'yyyy-MM-dd')
  const dispatch = useDispatch()
  /* console.log('sections', sections) */
  /* console.log('users', users) */

  const cleanFetch = async () => {
    await patientsApi
      .getCalendar(token, startMonth, endMonth)
      .then(({ data }) => {
        setData(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const fetchCommons = async () => {
    try {
      await dispatch(commonActions.getCommon(token))
    } catch (err) {
      console.log('err', err)
    }
  }
  const fetchCalendar = () => {
    setRefreshing(true)
    cleanFetch()
    fetchCommons()
    setRefreshing(false)
  }

  React.useEffect(() => {
    let cleanup = false
    if (!cleanup) {
      fetchCalendar()
    }
    return () => {
      cleanup
    }
  }, [])

  return (
    <Container>
      <Content style={safe}>
        {refreshing ? (
          <Spinner color='blue' size='large' color='#2A86FF' />
        ) : (
          <Calendar date={date} data={data} navigation={navigation} />
        )}
      </Content>
    </Container>
  )
}

const safe = { flex: 1, paddingTop: 10, paddingLeft: 20, paddingRight: 20 }

export default AppointmentDateScreen
