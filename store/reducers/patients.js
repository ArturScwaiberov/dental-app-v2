import { GET_PATIENTS } from '../actions/patients'

const initialState = {
  patients: [],
  loading: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOADER':
      return {
        ...state,
        loading: action.payload,
      }
    case GET_PATIENTS:
      return {
        patients: action.patients,
        loading: action.payload,
      }
    default:
      return state
  }
}
