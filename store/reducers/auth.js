import { SIGNIN, SIGNOUT } from '../actions/auth'

const initialState = {
  token: null,
  customerId: null,
  refreshToken: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGNIN:
      return {
        ...state,
        token: action.token,
        customerId: action.customerId,
        refreshToken: action.refreshToken,
      }
    case SIGNOUT:
      return initialState
    default:
      return state
  }
}
