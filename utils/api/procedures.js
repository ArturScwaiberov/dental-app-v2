import axios from '../../core/axios'

export default {
  get: (token, id) =>
    axios.get(`/patients/${id}/procedures`, {
      headers: { authorization: token },
    }),
}
