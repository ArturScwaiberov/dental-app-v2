import { SIGNIN, SIGNOUT } from '../actions/auth'

const initialState = {
  token: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGNIN:
      return {
        ...state,
        token: action.token,
      }
    case SIGNOUT:
      return initialState
    default:
      return state
  }
}
