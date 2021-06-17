import React, { useState } from 'react'
import { Spinner } from 'native-base'
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/native'
import * as dateFns from 'date-fns'

import * as calendarActions from '../../store/actions/calendar'
import { appointmentsApi } from '../../utils/api'

const WEEK_STARTS_ON_MONDAY = {
  weekStartsOn: 1,
}

const SLOT_INTERVAL = 15

const CalendarHeader = ({ date, onNextMonth, onPreviousMonth }) => {
  const thisMonth = dateFns.format(date, 'LLLL')
  const previousMonth = dateFns.format(dateFns.subMonths(date, 1), 'LLLL')

  const nextMonth = dateFns.format(dateFns.addMonths(date, 1), 'LLLL')

  const thisYear = dateFns.format(date, 'yyyy')

  const isPreviousDisabled = dateFns.isSameMonth(
    dateFns.subMonths(date, 1),
    dateFns.subMonths(new Date(), 1)
  )

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      }}
    >
      <View style={{ flexBasis: '30%' }}>
        <OneMonth onPress={onPreviousMonth} disabled={isPreviousDisabled}>
          <H4 style={isPreviousDisabled ? styles.disabled : null}>{previousMonth}</H4>
        </OneMonth>
      </View>
      <View style={{ flexBasis: '40%' }}>
        <CenteredView>
          <H1>{thisMonth}</H1>
        </CenteredView>
        <CenteredView>
          <H5>{thisYear}</H5>
        </CenteredView>
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexBasis: '30%',
          justifyContent: 'flex-end',
        }}
      >
        <OneMonth onPress={onNextMonth}>
          <H4>{nextMonth}</H4>
        </OneMonth>
      </View>
    </View>
  )
}

const DayNames = ({ date }) => {
  const startDate = dateFns.startOfWeek(date, WEEK_STARTS_ON_MONDAY)

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      {[0, 1, 2, 3, 4, 5, 6].map((key) => (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          key={key}
        >
          <H4>{dateFns.format(dateFns.addDays(startDate, key), 'EEE')}</H4>
        </View>
      ))}
    </View>
  )
}

const Days = ({ date }) => {
  const [weekInMonthIndex, setWeekInMonthIndex] = useState(null)
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)
  const [freeSlots, setFreeSlots] = useState([])
  const [showTimeSlots, setShowTimeSlots] = useState(false)

  const token = useSelector((state) => state.auth.token)
  const selectedDay = useSelector((state) => state.calendar.selectedDay)
  const selectedTimeSlots = useSelector((state) => state.calendar.selectedTimeSlots)
  const dispatch = useDispatch()

  const setSelectedDay = (day) => dispatch(calendarActions.setSelectedDay(day))
  const setSelectedTimeSlots = (timeSlots) =>
    dispatch(calendarActions.setSelectedTimeSlots(timeSlots))

  const monthStart = dateFns.startOfMonth(date)
  const monthEnd = dateFns.endOfMonth(monthStart)
  const startDate = dateFns.startOfWeek(monthStart, WEEK_STARTS_ON_MONDAY)
  const endDate = dateFns.endOfWeek(monthEnd, WEEK_STARTS_ON_MONDAY)

  const [error, setError] = React.useState('')

  const weeksInMonth = []
  let dayCounter = startDate
  while (dayCounter <= endDate) {
    const week = []
    for (let i = 0; i < 7; i++) {
      week.push(dateFns.addDays(dayCounter, i))
    }
    weeksInMonth.push(week)
    dayCounter = dateFns.addDays(dayCounter, 7)
  }

  React.useEffect(() => {
    const weekInMonthIndex = weeksInMonth.findIndex((week) =>
      week.some((day) => dateFns.isSameDay(day, selectedDay))
    )
    setShowTimeSlots(true)
    onDayPress(weekInMonthIndex, selectedDay)
  }, [])

  const onDayPress = async (weekInMonthIndex, selectedDay) => {
    if (isLoadingTimeSlots) {
      return
    }
    setSelectedTimeSlots([])

    setWeekInMonthIndex(weekInMonthIndex)
    setSelectedDay(selectedDay)

    const selectedDayFormated = dateFns.format(selectedDay, 'yyyy-MM-dd')

    setIsLoadingTimeSlots(true)
    try {
      const { data } = await appointmentsApi.getFreeSlots(token, {
        day: selectedDayFormated,
        interval: SLOT_INTERVAL,
      })

      setFreeSlots(
        Object.keys(data)
          .map((key) => {
            const startAt = dateFns.parseISO(key)
            return {
              startAt,
              ...data[key],
            }
          })
          .filter((s) => dateFns.isFuture(s.startAt))
          .sort((a, b) => dateFns.compareAsc(a.startAt, b.startAt))
      )
    } catch (error) {
      setError('Error: ' + error)
    }

    setIsLoadingTimeSlots(false)
  }

  const toggleHandler = (i, day) => () => {
    if (dateFns.isSameDay(selectedDay, day) && showTimeSlots) {
      setShowTimeSlots(false)
      setSelectedTimeSlots([])
    } else {
      setShowTimeSlots(true)
      onDayPress(i, day)
    }
  }

  const roundTimePressHandler = (slot) => () => {
    const slotIndex = selectedTimeSlots.findIndex((s) => dateFns.isEqual(s.startAt, slot.startAt))

    if (slotIndex >= 0) {
      setSelectedTimeSlots(selectedTimeSlots.slice(0, slotIndex))
    } else {
      setSelectedTimeSlots(
        [...selectedTimeSlots, slot].sort((a, b) => dateFns.compareAsc(a.startAt, b.startAt))
      )
    }
  }

  if (error) {
    return <Text style={label}>{error}</Text>
  }

  return (
    <View>
      {weeksInMonth.map((week, i) => (
        <View key={i}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {week.map((day, j) => {
              const isSameMonthDay = dateFns.isSameMonth(day, monthStart)

              const isSelectedDay = dateFns.isSameDay(day, selectedDay)

              const isPastDay =
                dateFns.compareAsc(day, dateFns.subDays(new Date(), 1)) < 1 ? true : false

              const isDisabledDay = !isSameMonthDay || (isSameMonthDay && isPastDay)

              return (
                <View
                  key={j}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <DayButton
                    onPress={toggleHandler(i, day)}
                    disabled={isDisabledDay}
                    style={[
                      isDisabledDay ? styles.disabled : null,
                      isSelectedDay ? styles.selected : null,
                    ]}
                  >
                    <H4 style={[isDisabledDay ? styles.disabled : null]}>
                      {dateFns.format(day, 'd')}
                    </H4>
                  </DayButton>
                </View>
              )
            })}
          </View>
          {showTimeSlots &&
          weekInMonthIndex === i &&
          week.some((weekDay) => dateFns.isSameMonth(selectedDay, weekDay)) ? (
            <View>
              {isLoadingTimeSlots ? (
                <Spinner color='blue' size='large' color='#2A86FF' />
              ) : (
                <RoundsHolderTimes>
                  {freeSlots.length > 0 && (
                    <H5
                      style={{
                        alignSelf: 'center',
                        margin: 5,
                        textAlign: 'center',
                      }}
                    >
                      Choose appointment time
                    </H5>
                  )}
                  <RoundsRowHolderTimes>
                    {freeSlots.length ? (
                      freeSlots.map((s, i) => {
                        const isSelected = selectedTimeSlots.find((t) =>
                          dateFns.isEqual(s.startAt, t.startAt)
                        )

                        const isDisabled = selectedTimeSlots.length
                          ? isSelected
                            ? false
                            : Math.abs(
                                dateFns.differenceInMinutes(s.startAt, selectedTimeSlots[0].startAt)
                              ) === SLOT_INTERVAL ||
                              Math.abs(
                                dateFns.differenceInMinutes(
                                  s.startAt,
                                  selectedTimeSlots[selectedTimeSlots.length - 1].startAt
                                )
                              ) === SLOT_INTERVAL
                            ? false
                            : true
                          : false

                        return (
                          <RoundTime
                            onPress={roundTimePressHandler(s)}
                            disabled={isDisabled}
                            key={i}
                            style={[
                              isSelected
                                ? {
                                    backgroundColor: '#08cf4a',
                                  }
                                : null,
                              isDisabled ? styles.disabled : null,
                            ]}
                          >
                            <H5Active
                              style={[
                                isSelected
                                  ? {
                                      color: '#fff',
                                    }
                                  : null,
                                isDisabled ? styles.disabled : null,
                              ]}
                            >
                              {dateFns.format(s.startAt, 'HH:mm')}
                            </H5Active>
                          </RoundTime>
                        )
                      })
                    ) : (
                      <H5>No available time for this day!</H5>
                    )}
                  </RoundsRowHolderTimes>
                </RoundsHolderTimes>
              )}
            </View>
          ) : null}
        </View>
      ))}

      <RoundsHolder>
        <RoundsRowHolder>
          <RoundClosed />
          <H5>Day off</H5>
        </RoundsRowHolder>
        <RoundsRowHolder>
          <RoundApp />
          <H5>Working day, times available</H5>
        </RoundsRowHolder>
        <RoundsRowHolder>
          <RoundNoApp />
          <H5>Working day, times not available</H5>
        </RoundsRowHolder>
      </RoundsHolder>
    </View>
  )
}

const CalendarV2 = () => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const onNextMonth = () => {
    setCurrentDate(dateFns.addMonths(currentDate, 1))
  }

  const onPreviousMonth = () => {
    setCurrentDate(dateFns.subMonths(currentDate, 1))
  }

  return (
    <View>
      <CalendarHeader
        date={currentDate}
        onNextMonth={onNextMonth}
        onPreviousMonth={onPreviousMonth}
      />
      <DayNames date={currentDate} />

      <Days date={currentDate} />
    </View>
  )
}

const styles = StyleSheet.create({
  disabled: {
    backgroundColor: '#fff',
    color: '#ccc',
  },
  selected: {
    borderWidth: 1,
    borderColor: '#555',
  },
})

const CenteredView = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
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
  backgroundColor: '#ff695e',
  marginRight: 7,
})

const RoundApp = styled.View({
  height: 13,
  width: 13,
  borderRadius: 13,
  backgroundColor: '#ecf0d8',
  marginRight: 7,
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

const H1 = styled.Text({
  fontSize: 28,
  color: '#333',
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

const label = {
  marginTop: 20,
  fontSize: 16,
  color: '#484848',
  textAlign: 'center',
  fontFamily: 'Roboto',
}

export default CalendarV2
