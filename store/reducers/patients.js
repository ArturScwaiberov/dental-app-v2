import { GET_PATIENTS, GET_CUR_PATIENT,SET_PATIENT_LOADING,SET_APPOINTMENTS,SET_INVOICES } from '../actions/patients'

const initialState = {
  patients: [],
  currentPatient: [],
  loading: false,
  patientLoading: false,
  appointments: [],
  invoices: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PATIENT_LOADING:
      return {
        ...state,
        patientLoading: action.payload
      }

    case SET_APPOINTMENTS:
      return {
        ...state,
        appointments: action.payload
      }

    case SET_INVOICES: 
      return {
        ...state,
        invoices: action.payload
      }
    case 'SET_LOADER':
      return {
        ...state,
        loading: action.payload,
      }
    case GET_CUR_PATIENT:
      return {
        ...state,
        currentPatient: action.currentPatient,
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
