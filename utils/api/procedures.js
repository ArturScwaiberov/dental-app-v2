import axios from '../../core/axios'

export default {
  get: (token, id) =>
    axios.get(`/patients/${id}/procedures`, {
      headers: { authorization: token },
    }),
  getInvoiceProcedures: (token,patientId,invoiceId) => axios.get(`/patients/${patientId}/invoices/${invoiceId}/procedures`,{
    headers: { authorization: token },
  }),
  getInvoicePayments: (token,patientId,invoiceId) => axios.get(`/patients/${patientId}/invoices/${invoiceId}/payments`,{
    headers: { authorization: token },
  })
}
