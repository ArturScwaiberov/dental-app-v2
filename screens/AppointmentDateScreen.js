import React from 'react'
import { Container, Content, Spinner } from 'native-base'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'

import { patientsApi } from '../utils'
import CalendarV2 from '../src/components/CalendarV2'
import * as commonActions from '../store/actions/common'
import * as patientsActions from '../store/actions/patients'
import { Text } from 'react-native'

const AppointmentDateScreen = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = React.useState(true)
  const [data, setData] = React.useState([])
  const token = useSelector((state) => state.auth.token)
  const [error, setError] = React.useState('')

  const date = new Date()
  const startMonth = format(startOfMonth(date), 'yyyy-MM-dd')
  const endMonth = format(endOfMonth(date), 'yyyy-MM-dd')
  const dispatch = useDispatch()

  const fetchCalendar = async () => {
    await patientsApi
      .getCalendar(token, startMonth, endMonth)
      .then(({ data }) => {
        setData(data)
      })
      .catch((err) => {
        setError(err)
      })
  }

  const fetchCommons = async () => {
    try {
      await dispatch(commonActions.getCommon(token))
    } catch (err) {
      setError('ERROR fetching commons: ' + err.message)
    }
  }

  const fetchPatients = async () => {
    try {
      await dispatch(patientsActions.getPatients(token))
    } catch (err) {
      setError('ERROR fetching patients: ' + err.message)
    }
  }

  const fetchAll = async () => {
    setRefreshing(true)
    await fetchCalendar()
    await fetchCommons()
    await fetchPatients()
    setRefreshing(false)
  }

  React.useEffect(() => {
    let cleanup = false
    if (!cleanup) {
      fetchAll()
    }
    return () => {
      cleanup
    }
  }, [])

  if (error) {
    return <Text style={label}>{error}</Text>
  }

  return (
    <Container>
      <Content style={safe}>
        {refreshing ? <Spinner color='blue' size='large' color='#2A86FF' /> : <CalendarV2 />}
      </Content>
    </Container>
  )
}

const safe = { flex: 1, paddingTop: 10, paddingLeft: 20, paddingRight: 20 }
const label = {
  marginTop: 20,
  fontSize: 16,
  color: '#484848',
  textAlign: 'center',
  fontFamily: 'Roboto',
}

export default AppointmentDateScreen
