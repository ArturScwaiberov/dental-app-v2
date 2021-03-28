import axios from '../../core/axios'

export default {
  get: (token, id) =>
    axios.get(
      `https://cpfxbicmq4.execute-api.us-east-1.amazonaws.com/prod/v1/patients/${id}/appointments`,
      {
        headers: { authorization: token },
      }
    ),
  add: (token, data, id) =>
    axios.post(
      `https://cpfxbicmq4.execute-api.us-east-1.amazonaws.com/prod/v1/patients/${id}/appointments`,
      data,
      {
        headers: { authorization: token },
      }
    ),
  remove: (id) => axios.delete('/appointments/remove/' + id),
  update: (id, values) => axios.patch('appointments/update/' + id, values),
}
