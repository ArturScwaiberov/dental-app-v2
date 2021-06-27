import axios from '../../core/axios'
import Clinic from '../../models/clinic'
import Section from '../../models/section'
import User from '../../models/user'
import Procedure from '../../models/procedure'

export const GET_COMMON = 'GET_COMMON'
export const DROP_COMMON = 'DROP_COMMON'

export const getCommon = (token) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/common`, {
        headers: { authorization: token },
      })

      const respData = data

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
            respData.users[key].id,
            respData.users[key].person.fullName,
            respData.users[key].person.phone,
            respData.users[key].rules[0].isEnabled,
            respData.users[key].rules[0].isDentist,
            respData.users[key].rules[0].isAssistant
          )
        )
      }

      const loadedProcedures = []
      for (const key in respData.procedures) {
        loadedProcedures.push(
          new Procedure(
            respData.procedures[key].id,
            respData.procedures[key].categoryIndex,
            respData.procedures[key].code,
            respData.procedures[key].fee,
            respData.procedures[key].name
          )
        )
      }

      const loadedClinic = new Clinic(
        respData.clinic.id,
        respData.clinic.name,
        respData.clinic.phone,
        respData.clinic.email,
        respData.clinic.operatingHours
      )

      dispatch({
        type: GET_COMMON,
        sections: loadedSections,
        clinic: loadedClinic,
        users: loadedUsers,
        procedures: loadedProcedures,
      })
    } catch (err) {
      throw new Error(err)
    }
  }
}
