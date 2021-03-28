import Section from '../../models/section'
import User from '../../models/user'

export const GET_COMMON = 'GET_COMMON'
export const DROP_COMMON = 'DROP_COMMON'

export const getCommon = (token) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://cpfxbicmq4.execute-api.us-east-1.amazonaws.com/prod/v1/common`,
        {
          method: 'GET',
          headers: { authorization: token },
        }
      )

      const respData = await response.json()

      const loadedSections = []
      for (const key in respData.sections) {
        loadedSections.push(
          new Section(
            respData.sections[key].id,
            respData.sections[key].name,
            respData.sections[key].parentId,
            respData.sections[key].isDeleted
          )
        )
      }

      const loadedUsers = []
      for (const key in respData.users) {
        loadedUsers.push(
          new User(
            respData.users[key].person.id,
            respData.users[key].person.fullName,
            respData.users[key].rules[0].isEnabled,
            respData.users[key].rules[0].isDentist,
            respData.users[key].rules[0].isAssistant
          )
        )
      }

      dispatch({ type: GET_COMMON, sections: loadedSections, users: loadedUsers })
    } catch (err) {
      console.log('ERROR after getting common: ', err)
    }
  }
}
