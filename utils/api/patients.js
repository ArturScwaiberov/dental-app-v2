import axios from '../../core/axios'

export default {
  get: (token) =>
    axios.get('https://cpfxbicmq4.execute-api.us-east-1.amazonaws.com/prod/v1/patients', {
      headers: { authorization: token },
    }),
  add: (token, data) =>
    axios.post('https://cpfxbicmq4.execute-api.us-east-1.amazonaws.com/prod/v1/patients', data, {
      headers: { authorization: token },
    }),
  getCalendar: (token, start, end) =>
    axios.get(
      `https://cpfxbicmq4.execute-api.us-east-1.amazonaws.com/prod/v1/appointments/${start}/${end}`,
      {
        headers: { authorization: token },
      }
    ),
  remove: (id) => axios.delete('patients/remove/' + id),
  update: (id, values) => axios.patch('patients/update/' + id, values),
}
