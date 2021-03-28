import { GET_PATIENTS } from '../actions/patients'

const initialState = {
  patients: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PATIENTS:
      return {
        patients: action.patients,
      }
  }
  return state
}
