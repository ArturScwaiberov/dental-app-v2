import axios from '../../core/axios'

export default {
  get: (token) =>
    axios.get('/common', {
      headers: { authorization: token },
    }),
}
