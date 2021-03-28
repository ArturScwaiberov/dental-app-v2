import axios from 'axios'

export default {
  get: (token) =>
    axios.get('https://cpfxbicmq4.execute-api.us-east-1.amazonaws.com/prod/v1/common', {
      headers: { authorization: token },
    }),
}
