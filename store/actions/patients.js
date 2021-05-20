import axios from '../../core/axios'
import Patient from '../../models/patient'

export const GET_PATIENTS = 'GET_PATIENTS'
const setLoaderAction = (payload) => ({
  type: 'SET_LOADER',
  payload,
})

export const getPatients = (token) => {
  return async (dispatch) => {
    dispatch(setLoaderAction(true))
    try {
      const { data } = await axios.get(`/patients`, {
        headers: { authorization: token },
      })

      const respDataArray = data[0]

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

      dispatch({ type: GET_PATIENTS, patients: loadedPatients, payload: true })
    } catch (err) {
      throw new Error(err)
    } finally {
      dispatch(setLoaderAction(false))
    }
  }
}
