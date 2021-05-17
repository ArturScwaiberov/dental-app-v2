import React,{useState} from 'react'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import { Container, Content, Icon, Spinner } from 'native-base'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import * as dateFns from 'date-fns'

import { patientsApi } from '../utils'
import CalendarV2 from '../src/components/CalendarV2'
import NewCalendar from '../src/components/NewCalendar'
import * as commonActions from '../store/actions/common'
import * as patientsActions from '../store/actions/patients'


const AppointmentDateScreen = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = React.useState(true)
  const [data, setData] = React.useState([])
  const token = useSelector((state) => state.auth.token)
  const sections = useSelector((state) => state.common.sections)
  const users = useSelector((state) => state.common.users)
  const clinic = useSelector((state) => state.common.clinic)

  /* const date = new Date('April 17, 2021 03:24:00') */
  const date = new Date()
  const startMonth = format(startOfMonth(date), 'yyyy-MM-dd')
  const endMonth = format(endOfMonth(date), 'yyyy-MM-dd')
  const dispatch = useDispatch()
  /* console.log('sections', sections) */
  /* console.log('users', users) */
  /* console.log('clinic', clinic) */

  const fetchCalendar = async () => {
    await patientsApi
      .getCalendar(token, startMonth, endMonth)
      .then(({ data }) => {
        setData(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  /* console.log('data__________', data) */

  const fetchCommons = async () => {
    try {
      await dispatch(commonActions.getCommon(token))
    } catch (err) {
      console.log('ERROR fetching commons', err.message)
    }
  }

  const fetchPatients = async () => {
    try {
      await dispatch(patientsActions.getPatients(token))
    } catch (err) {
      console.log('ERROR fetching patients', err.message)
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

  // console.log(`selectedTimeSlots`, selectedTimeSlots);

  return (
    <Container>
      <Content style={safe}>
        {refreshing ? (
          <Spinner color='blue' size='large' color='#2A86FF' />
        ) : (
          <CalendarV2 />
        )}
      </Content>
      
      {/* {
        selectedTimeSlots.length ? <TouchableOpacity
        style={{
          position: 'absolute',
          top: -30,
          right: 10,
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: '#2A86FF',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 10000
        }}

        onPress={goToConfirmScreen}
      >
        
        <Icon
          name='arrow-right-thick'
          type='MaterialCommunityIcons'
          style={{ color: 'white' }}
        />
      </TouchableOpacity> : null
      } */}
      
    </Container>
  )
}

const safe = { flex: 1, paddingTop: 10, paddingLeft: 20, paddingRight: 20 }

export default AppointmentDateScreen
{
  /* <NewCalendar /> */
}
