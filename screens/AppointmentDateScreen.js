import React from 'react'
import { Container, Content,
  //  Spinner
   } from 'native-base'
// import { endOfMonth, format, startOfMonth } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
// import { Text } from 'react-native'

// import { patientsApi } from '../utils'
import CalendarV2 from '../src/components/CalendarV2'
import * as commonActions from '../store/actions/common'
import * as patientsActions from '../store/actions/patients'

const AppointmentDateScreen = ({ navigation, route }) => {
  // const patientLoading = useSelector((state) => state.patients.patientLoading)
  // const [data, setData] = React.useState([])
  const token = useSelector((state) => state.auth.token)
  // const [error, setError] = React.useState('')

  // const date = new Date()
  // const startMonth = format(startOfMonth(date), 'yyyy-MM-dd')
  // const endMonth = format(endOfMonth(date), 'yyyy-MM-dd')
  const dispatch = useDispatch()

  // const fetchCalendar = async () => {
  //   await patientsApi
  //     .getCalendar(token, startMonth, endMonth)
  //     .then(({ data }) => {
  //       setData(data)
  //     })
  //     .catch((err) => {
  //       setError(err)
  //     })
  // }

  const fetchCommons = async () => {
    await dispatch(commonActions.getCommon(token))
  }

  const fetchPatients = async () => {
    await dispatch(patientsActions.getPatients(token))
  }

  const fetchAll = async () => {
    dispatch(patientsActions.setPatientLoading(true))
    // await fetchCalendar()
    await fetchCommons()
    await fetchPatients()
    dispatch(patientsActions.setPatientLoading(false))
  }

  React.useEffect(() => {
    fetchAll()
  }, [])

  // if (error) {
  //   return <Text style={label}>{error}</Text>
  // }

  return (
    <Container>
      <Content style={safe}>
      <CalendarV2 />
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
