import axios from 'axios'

export default {
  get: (token, id) =>
    axios.get(
      `https://cpfxbicmq4.execute-api.us-east-1.amazonaws.com/prod/v1/patients/${id}/procedures`,
      {
        headers: { authorization: token },
      }
    ),
}
