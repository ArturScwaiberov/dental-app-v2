import axios from '../../core/axios'
import Patient from '../../models/patient'
import { appointmentsApi, patientsApi } from '../../utils'

export const GET_PATIENTS = 'GET_PATIENTS'
export const GET_CUR_PATIENT = 'GET_CUR_PATIENT'
export const SET_PATIENT_LOADING = 'SET_PATIENT_LOADING'
export const SET_INVOICES = 'SET_INVOICES'
export const SET_APPOINTMENTS = 'SET_APPOINTMENTS'

const setLoaderAction = (payload) => ({
  type: 'SET_LOADER',
  payload,
})

export const setPatientLoading = (payload) => ({
  type: SET_PATIENT_LOADING,
  payload
})

export const fetchAppointments = (token,patientId) => {
  return async (dispatch) => {
    try {
      const { data: appointments } = await appointmentsApi.get(token, patientId)
      dispatch({type: SET_APPOINTMENTS,payload: appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))})
    } catch (error) {
      throw new Error(error)
    }
  }
}

export const fetchInvoices = (token,patientId) => {
  return async (dispatch) => {
    try {
      const { data } = await patientsApi.getInvoices(token, patientId)
      dispatch({type: SET_INVOICES,payload: data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))})
    } catch (error) {
      throw new Error(error)
    }
  }
}
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

export const getPatient = (token, id) => {
  return async (dispatch) => {
    dispatch(setLoaderAction(true))
    try {
      const { data } = await axios.get(`/patients/${id}`, {
        headers: { authorization: token },
      })

      dispatch({ type: GET_CUR_PATIENT, currentPatient: data, payload: true })
    } catch (err) {
      throw new Error(err)
    } finally {
      dispatch(setLoaderAction(false))
    }
  }
}
