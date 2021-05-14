import Auth from '@aws-amplify/auth'
export const SIGNIN = 'SIGNIN'
export const SIGNOUT = 'SIGNOUT'

export const loginCurrent = (cb) => {
  return async (dispatch) => {
    try {
      const user = await Auth.currentSession()
      const token = (await Auth.currentSession()).getIdToken().getJwtToken()

      const cognitoUser = await Auth.currentAuthenticatedUser()
      const currentSession = await Auth.currentSession()
      cognitoUser.refreshSession(currentSession.refreshToken, (err, session) => {
        const { idToken, refreshToken, accessToken } = session

        dispatch({
          type: SIGNIN,
          token: idToken.jwtToken,
          customerId: idToken.payload.sub,
          refreshToken: refreshToken.token,
        })

        cb && cb(true)
      })
    } catch (err) {
      console.log('ERROR auto sign in:', err)
      cb && cb(false)
    }
  }
}

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const user = await Auth.signIn(email, password)

      dispatch({
        type: SIGNIN,
        token: user.signInUserSession.idToken.jwtToken,
        customerId: user.signInUserSession.idToken.payload.sub,
      })
    } catch (err) {
      if (err.code === 'NotAuthorizedException') {
        throw new Error('Incorrect username or password.')
      } else if (err.code === 'NetworkError') {
        throw new Error('Network Error')
      }
      console.log('ERROR sign in:', err)
    }
  }
}

export const logout = () => {
  return async (dispatch) => {
    try {
      await Auth.signOut()

      dispatch({
        type: SIGNOUT,
      })
    } catch (err) {
      console.log('ERROR sign out: ', err)
    }
  }
}
