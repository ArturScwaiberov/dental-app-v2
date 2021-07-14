import axios from '../../core/axios'

export default {
  get: (token) => axios.get('/patients',{
    headers: {authorization: token},
  }),
  getPatient: (token, id) =>
    axios.get(`/patients/${id}`, {
      headers: { authorization: token },
    }),
  add: (token, data) =>
    axios.post('/patients', data, {
      headers: { authorization: token },
    }),
  getCalendar: (token, start, end) =>
    axios.get(`/appointments/${start}/${end}`, {
      headers: { authorization: token },
    }),
  update: (id, values) => axios.patch('/patients/update/' + id, values),
  deleteNote: (token, patientId, noteId) =>
		axios.post(
			`patients/${patientId}/notes/delete`,
			{
				data: [
					{
						id: noteId,
						patientId,
					},
				],
			},
			{
				headers: { authorization: token },
			},
		),
    getInvoices: (token,patientId) => axios.get(`/patients/${patientId}/invoices`,{headers: { authorization: token }}),
    cancelPayment: (token,patientId,invoiceId,paymentId,data) => axios.put(`/patients/${patientId}/invoices/${invoiceId}/payments/${paymentId}`,data,{headers: { authorization: token }}),
    addInvoicePayment: (token,patientId,invoiceId,data) => axios.post(`/patients/${patientId}/invoices/${invoiceId}/payments`,data,{headers: { authorization: token }}),
    addPayment: (token,patientId,data) => axios.post(`/patients/${patientId}/balance`,data,{headers: { authorization: token }}),
    createInvoice: (token,patientId,data) => axios.post(`/patients/${patientId}/invoices`,data,{headers: { authorization: token }}),
    addProcedures: (token,patientId,data) => axios.post(`/patients/${patientId}/procedures`,data,{headers: { authorization: token }})
}
