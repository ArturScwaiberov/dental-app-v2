import axios from '../../core/axios'

export default {
  get: (token) =>
    axios.get('/patients', {
      headers: { authorization: token },
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
}
