import { GET_NOTES, SET_NOTES } from '../actions/notes'

const initialState = {
  notes: [],
  loading: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOADER':
      return {
        ...state,
        loading: action.payload,
      }
    case GET_NOTES:
      return {
        ...state,
        notes: action.notes,
        loading: action.payload,
      }
    case SET_NOTES:
      return {
        ...state,
        notes: action.notes,
        loading: action.payload,
      }
    default:
      return state
  }
}
