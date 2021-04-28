import React from 'react'
import { Button, Text, View } from 'react-native'

const myCalendar = () => {
  const [activeDate, setActiveDate] = React.useState(new Date())
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  // текущий год и текущий месяц для получения первого дня месяца
  const year = activeDate.getFullYear()
  const month = activeDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()

  // добавляем февралю день в високосный год
  let maxDays = nDays[month]
  if (month == 1) {
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      maxDays += 1
    }
  }

  function generateMatrix() {
    var matrix = []
    // первый день недели для заголовка календаря
    matrix[0] = weekDays

    let counter = 1
    for (let row = 0; row < 7; row++) {
      matrix[row] = []
      for (let col = 0; col < 7; col++) {
        matrix[row][col] = -1
        if (row == 1 && col >= firstDay) {
          // заполняем только после первого дня в месяце
          matrix[row][col] = counter++
        } else if (row > 1 && counter <= maxDays) {
          // заполняем только если счетчик не больше чем дней в месяце
          matrix[row][col] = counter++
        }
      }
    }

    return matrix
  }

  const matrix = generateMatrix()

  const datePressHandler = (item) => {
    setActiveDate(() => {
      if (!item.match && item != 1) {
        activeDate.setDate(item)
        console.log(activeDate)
        return activeDate
      }
    })
  }

  const changeMonth = (n) => {
    setActiveDate(() => {
      activeDate.setMonth(activeDate.getMonth() + n)
      return activeDate
    })
  }

  let rows = []
  rows = matrix.map((row, rowIndex) => {
    const rowItems = row.map((item, colIndex) => {
      return (
        <Text
          key={colIndex}
          style={{
            flex: 1,
            height: 18,
            textAlign: 'center',
            backgroundColor: rowIndex == 0 ? '#ddd' : '#fff',
            color: colIndex == 0 ? '#a00' : '#000',
            fontWeight: item == activeDate.getDate() ? 'bold' : 'normal',
            borderColor: item == activeDate.getDate() ? '#ddd' : null,
            borderRadius: 1,
          }}
          onPress={() => (item != -1 ? datePressHandler(item) : '')}
        >
          {rowIndex == 0 ? weekDays[colIndex] : ''}
          {item != -1 ? item : ''}
        </Text>
      )
    })
    return (
      <View
        key={rowIndex}
        style={{
          flex: 1,
          flexDirection: 'row',
          padding: 15,
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {rowItems}
      </View>
    )
  })

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button title='Prev' onPress={() => changeMonth(-1)} />
        <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
          {months[activeDate.getMonth()]} {activeDate.getFullYear()}
        </Text>
        <Button title='Next' onPress={() => changeMonth(+1)} />
      </View>
      {rows}
    </View>
  )
}

export default myCalendar
