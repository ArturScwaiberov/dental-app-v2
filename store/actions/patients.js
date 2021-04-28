import axios from '../../core/axios'
import Patient from '../../models/patient'

export const GET_PATIENTS = 'GET_PATIENTS'

export const getPatients = (token) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/patients`, {
        headers: { authorization: token },
      })

      const respData = await response.json()
      const respDataArray = respData[0]

      const loadedPatients = []
      for (const key in respDataArray) {
        loadedPatients.push(
          new Patient(
            respDataArray[key].id,
            respDataArray[key].person.fullName,
            respDataArray[key].person.phone,
            respDataArray[key].person.birthday,
            respDataArray[key].person.sex,
            respDataArray[key].statsInvoices.totalInvoiced,
            respDataArray[key].statsInvoices.totalDebts,
            respDataArray[key].appointments,
            respDataArray[key].person.photoLink
          )
        )
      }

      dispatch({ type: GET_PATIENTS, patients: loadedPatients })
    } catch (err) {
      console.log('ERROR getting patients: ', err)
    }
  }
}
