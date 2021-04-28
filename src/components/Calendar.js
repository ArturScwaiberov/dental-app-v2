import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import {
  add,
  sub,
  addDays,
  endOfMonth,
  format,
  getDate,
  startOfMonth,
  startOfWeek,
  compareAsc,
  startOfToday,
} from 'date-fns'
import ruLocale from 'date-fns/locale/ru'
import { View } from 'react-native'

const getWeekDays = (date, startDayNumberOfMonth) => {
  const startDateOfMonth = startOfMonth(date, { weekStartsOn: 1 })
  const startOfWeek = startOfMonth(date, { weekStartsOn: 1 })
  console.log('дата начала месяца', startDateOfMonth)
  /* console.log('startOfWeek', startOfWeek) */
  const endDayNumberOfMonth = format(endOfMonth(date), 'd')
  console.log('сколько дней в месяце', endDayNumberOfMonth)

  const final = []

  const correct = endDayNumberOfMonth % 10 ? startDayNumberOfMonth + 1 : startDayNumberOfMonth - 1

  /* нужно от нуля идти до последнего числа месяца, 
  после этого по циклу проходить по каждой неделе от начала недели и до ее конца 
  и все это пихать в фильный массив как отдельные объекты */
  for (let i = 0 - correct; i < endDayNumberOfMonth; i++) {
    const allDatesInMonth = addDays(startDateOfMonth, i)

    final.push({
      id: i,
      formattedRU: format(allDatesInMonth, 'EEEEEE', { locale: ruLocale }),
      formatted: format(allDatesInMonth, 'EEE'),
      formattedDate: format(allDatesInMonth, 'dd/MM/yyyy'),
      date: allDatesInMonth,
      day: getDate(allDatesInMonth),
    })
  }

  return final
}

const Calendar = ({ date, navigation, operatingHours }) => {
  const today = startOfToday()
  const [currDate, setCurrDate] = useState(today)
  const headerTime = format(currDate, 'EEE p, dd MMM')
  const currentDayNumber = format(currDate, 'd')
  const [week, setWeek] = useState([])
  const [isChoosed, setIsChoosed] = useState(currentDayNumber)
  /* console.log('operatingHours', operatingHours) */

  const startDayNumberOfMonth = Number(format(startOfMonth(date), 'i'))
  console.log('номер дня недели начала месяца', startDayNumberOfMonth)

  const times = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
  ]
  const thisMonth = toCapitalizeMonth(format(currDate, 'LLLL'))
  const nextMonth = format(add(new Date(currDate), { months: 1 }), 'LLLL')
  const prevMonth = format(sub(new Date(currDate), { months: 1 }), 'LLLL')
  const thisYear = format(currDate, 'yyyy')
  /* console.log(isChoosed) */

  function toDateFormat(d) {
    return format(d, 'dd/M/yyyy')
  }

  function toCapitalizeMonth(m) {
    return m.charAt(0).toUpperCase() + m.slice(1)
  }

  function compareDates(p, f) {
    if (compareAsc(p, f) == 1) {
      return 'firstLarge'
    } else if (compareAsc(p, f) == -1) {
      return 'secondLarge'
    } else return 'equals'
  }

  useEffect(() => {
    setWeek(getWeekDays(currDate, startDayNumberOfMonth))
  }, [currDate])

  const daysNames = Object.entries(week)
    .slice(0, 7)
    .map((entry) => entry[1])

  return (
    <View>
      <CalendarHolder>
        <H1>{thisMonth}</H1>
        <MonthsHolder>
          <OneMonth onPress={() => setCurrDate(sub(new Date(currDate), { months: 1 }))}>
            <H4>{prevMonth}</H4>
          </OneMonth>
          <OneMonth onPress={() => setCurrDate(add(new Date(currDate), { months: 1 }))}>
            <H4>{nextMonth}</H4>
          </OneMonth>
        </MonthsHolder>
        <H5>{thisYear}</H5>
      </CalendarHolder>
      <Container>
        {daysNames.map((dayName) => {
          return (
            <Week key={dayName.formatted}>
              <View style={{ paddingVertical: 5 }}>
                <DayText>{dayName.formatted[0].toUpperCase() + dayName.formatted.slice(1)}</DayText>
              </View>
            </Week>
          )
        })}
      </Container>

      <Container>
        {week.map((weekDay) => {
          /* console.log('weekDay', weekDay.date, currDate) */
          /* console.log('_________', compareDates(weekDay.date, currDate)) */
          const compare = compareDates(weekDay.date, currDate)
          return (
            <Week key={weekDay.date}>
              {compare === 'secondLarge' ? (
                <DayButton
                  style={dayButtonClosed}
                  onPress={() => {
                    console.log('secondLargeButton')
                  }}
                >
                  <NumberText style={numberTextClosed}>{weekDay.day}</NumberText>
                </DayButton>
              ) : (
                <DayButton
                  style={null}
                  onPress={() => {
                    console.log('secondLargeButton')
                  }}
                >
                  <NumberText style={null}>{weekDay.day}</NumberText>
                </DayButton>
              )}
              {/* <DayButton
                style={
                  weekDay.formattedDate < today
                    ? dayButtonClosed
                    : weekDay.formattedDate === today
                    ? dayButtonActivated
                    : null
                }
                onPress={() => setIsChoosed(weekDay.id + 1)}
              >
                <NumberText
                  style={
                    weekDay.formattedDate < today
                      ? numberTextClosed
                      : weekDay.formattedDate > today
                      ? null
                      : numberTextActivated
                  }
                >
                  {weekDay.day}
                </NumberText>
              </DayButton> */}
            </Week>
          )
        })}
      </Container>

      <RoundsHolderTimes>
        <H5 style={{ alignSelf: 'center', margin: 5 }}>Выберите удобное время</H5>
        <RoundsRowHolderTimes>
          {times.map((time) => {
            return (
              <RoundTime
                onPress={() =>
                  navigation.navigate('ConfirmAppointmentScreen', { headerTime: headerTime })
                }
                key={time}
              >
                <H5Active>{time}</H5Active>
              </RoundTime>
            )
          })}
        </RoundsRowHolderTimes>
      </RoundsHolderTimes>

      <RoundsHolder>
        <RoundsRowHolder>
          <RoundClosed />
          <H5>Не рабочий день</H5>
        </RoundsRowHolder>
        <RoundsRowHolder>
          <RoundNoApp />
          <H5>Рабочий день, записи нет</H5>
        </RoundsRowHolder>
        <RoundsRowHolder>
          <RoundApp />
          <H5>Рабочий день, запись есть</H5>
        </RoundsRowHolder>
      </RoundsHolder>
    </View>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  flex: 1,
})

const CalendarHolder = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  marginBottom: 10,
})

const MonthsHolder = styled.View({
  width: '100%',
  flexDirection: 'row',
  paddingHorizontal: 10,
  justifyContent: 'space-between',
  top: 0,
  position: 'absolute',
  zIndex: -1,
})

const OneMonth = styled.TouchableOpacity({
  margin: 4,
  padding: 8,
})

const RoundsHolder = styled.View({
  marginTop: 15,
  marginLeft: 5,
  marginBottom: 20,
})

const RoundsHolderTimes = styled.View({
  marginTop: 5,
  paddingTop: 5,
  borderTopWidth: 1,
  borderTopColor: '#ccc',
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
  flex: 1,
})

const RoundsRowHolder = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  marginBottom: 7,
})

const RoundsRowHolderTimes = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  marginBottom: 7,
  flex: 1,
  flexWrap: 'wrap',
})

const RoundClosed = styled.View({
  height: 13,
  width: 13,
  borderRadius: 13,
  backgroundColor: '#ccc',
  marginRight: 7,
})

const RoundTime = styled.TouchableOpacity({
  borderRadius: 13,
  margin: 4,
  padding: 8,
  borderWidth: 1,
  borderColor: '#84D269',
  flexBasis: '20%',
  justifyContent: 'center',
  alignItems: 'center',
})

const RoundNoApp = styled.View({
  height: 13,
  width: 13,
  borderRadius: 13,
  backgroundColor: '#ecf0d8',
  marginRight: 7,
})

const RoundApp = styled.View({
  height: 13,
  width: 13,
  borderRadius: 13,
  backgroundColor: '#ff695e',
  marginRight: 7,
})

const Week = styled.View({
  flexBasis: '14%',
  justifyContent: 'center',
  alignItems: 'center',
})

const DayText = styled.Text({
  color: '#555',
})

const DayButton = styled.TouchableOpacity({
  backgroundColor: '#ecf0d8',
  padding: 4,
  marginVertical: 7,
  borderRadius: 10,
  width: 33,
  height: 33,
  justifyContent: 'center',
  alignItems: 'center',
})

const dayButtonActive = {
  backgroundColor: '#ff695e',
}

const dayButtonActivated = {
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#555',
}

const dayButtonClosed = {
  backgroundColor: '#fff',
}

const NumberText = styled.Text({
  fontSize: 16,
  color: '#555',
})

const numberTextActive = {
  color: 'white',
}

const numberTextActivated = {
  color: '#555',
}

const numberTextClosed = {
  color: '#ccc',
}

const H1 = styled.Text({
  fontSize: 28,
  color: '#333',
})

const H3 = styled.Text({
  fontSize: 18,
  color: '#555',
})

const H4 = styled.Text({
  fontSize: 16,
  color: '#555',
})

const H5 = styled.Text({
  fontSize: 14,
  color: '#555',
})

const H5Active = styled.Text({
  fontSize: 14,
  color: '#08cf4a',
  fontFamily: 'Roboto_medium',
})

export default Calendar
