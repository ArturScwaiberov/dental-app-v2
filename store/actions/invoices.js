import axios from '../../core/axios'
import Invoice from '../../models/Invoice'

export const GET_INVOICES = 'GET_INVOICES'
export const SET_INVOICE = 'SET_INVOICE'

const setLoaderAction = (payload) => ({
  type: 'SET_LOADER',
  payload,
})

export const getInvoices = (token) => {
  return async (dispatch) => {
    dispatch(setLoaderAction(true))
    try {
      const { data } = await axios.get(`/patients/${patientId}/invoices`)
    } catch (err) {}
  }
}
