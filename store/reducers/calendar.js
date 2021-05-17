import { SET_SELECTED_DAY, SET_SELECTED_TIME_SLOTS } from '../actions/calendar'

const initialState = {
	selectedDay: new Date(),
	selectedTimeSlots: [],
}

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_SELECTED_DAY: {
			const { day } = action.payload
			return {
				...state,
				selectedDay: day,
			}
		}

		case SET_SELECTED_TIME_SLOTS: {
			const { timeSlots } = action.payload
			return {
				...state,
				selectedTimeSlots: timeSlots,
			}
		}
		default:
			return state
	}
}
