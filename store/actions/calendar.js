export const SET_SELECTED_DAY = 'SET_SELECTED_DAY'
export const SET_SELECTED_TIME_SLOTS = 'SET_SELECTED_TIME_SLOTS'

export const setSelectedDay = (day) => {
	return { type: SET_SELECTED_DAY, payload: { day } }
}

export const setSelectedTimeSlots = (timeSlots) => {
	return {
		type: SET_SELECTED_TIME_SLOTS,
		payload: { timeSlots },
	}
}
