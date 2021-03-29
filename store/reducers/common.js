import { GET_COMMON, DROP_COMMON } from '../actions/common'

const initialState = {
  procedures: [],
  sections: [],
  clinic: {},
  users: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_COMMON:
      return {
        ...state,
        sections: action.sections,
        clinic: action.clinic,
        users: action.users,
      }
    case DROP_COMMON:
      return initialState
    default:
      return state
  }
}
