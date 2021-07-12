import axios from '../../core/axios'
import Patient from '../../models/patient'

export const GET_PATIENTS = 'GET_PATIENTS'
export const GET_CUR_PATIENT = 'GET_CUR_PATIENT'

const setLoaderAction = (payload) => ({
  type: 'SET_LOADER',
  payload,
})

export const getPatients = (token) => {
  return async (dispatch) => {
    dispatch(setLoaderAction(true))
    try {
      const { data } = await axios.get(`/patients`, {
        headers: { authorization: token },
      })

      const respDataArray = data[0]

      const loadedPatients = []
      for (const key in respDataArray) {
        loadedPatients.push(
          new Patient(
            respDataArray[key].id,
            respDataArray[key].person.fullName,
            respDataArray[key].person.phone,
            respDataArray[key].person.birthday,
            respDataArray[key].person.sex,
            respDataArray[key].statsInvoices.totalInvoiced,
            respDataArray[key].statsInvoices.totalDebts,
            respDataArray[key].appointments,
            respDataArray[key].person.photoLink
          )
        )
      }

      dispatch({ type: GET_PATIENTS, patients: loadedPatients, payload: true })
    } catch (err) {
      throw new Error(err)
    } finally {
      dispatch(setLoaderAction(false))
    }
  }
}

export const getPatient = (token, id) => {
  return async (dispatch) => {
    dispatch(setLoaderAction(true))
    try {
      // const { data } = await axios.get(`/patients/${id}`, {
      //   headers: { authorization: token },
      // })

      const data = {
        "id": "ac449c4a-75a1-40c6-b3f7-2184b98d1ae6",
        "personId": "b63035f7-8170-4423-9b9b-2d653b16a6c3",
        "createdCustomerId": "c6955e1d-ed84-4509-95f5-b6a2329e95e7",
        "cognitoId": "b282e9d5-d219-4873-98c2-b9390a32264f",
        "clinicId": 3055,
        "internalIndex": 2,
        "code": null,
        "address1": null,
        "address2": null,
        "city": null,
        "province": null,
        "zipCode": null,
        "balance": "10.00",
        "discountPercent": "0.00",
        "phone2": "",
        "phone3": "",
        "phone4": "",
        "phone5": "",
        "isArchived": false,
        "isChild": false,
        "email": null,
        "customInfo": {},
        "isCountryside": false,
        "person": {
            "id": "b63035f7-8170-4423-9b9b-2d653b16a6c3",
            "fullName": "Adam Smith",
            "birthday": "1984-05-10",
            "sex": null,
            "photoLink": null,
            "address": null,
            "email": "30551614674554549@dentaltap.com",
            "phone": "+1",
            "timezoneOffset": 0,
            "language": "en",
            "createdAt": "2021-03-02T08:42:34.600Z"
        },
        "referral": null,
        "tags": [
            {
                "id": "24634405-00ac-4c3b-b11d-c6b67b15b88e",
                "patientId": "ac449c4a-75a1-40c6-b3f7-2184b98d1ae6",
                "clinicTagId": "49047cf9-6877-41ff-8552-982275bc0f81",
                "createdAt": "2021-03-02T17:53:06.088Z"
            },
            {
                "id": "4ce605c6-71f5-46f2-b3c2-80cee64b9cfc",
                "patientId": "ac449c4a-75a1-40c6-b3f7-2184b98d1ae6",
                "clinicTagId": "5defd6a0-6edf-4717-b702-6e694b93ee0f",
                "createdAt": "2021-06-17T09:12:07.127Z"
            }
        ],
        "insurances": [],
        "statsFeed": {
            "patientId": "ac449c4a-75a1-40c6-b3f7-2184b98d1ae6",
            "appointments": 20,
            "invoices": 7,
            "notes": 14,
            "tasks": 0,
            "documents": 1
        },
        "statsInvoices": {
            "patientId": "ac449c4a-75a1-40c6-b3f7-2184b98d1ae6",
            "totalInvoiced": "117.00",
            "totalPaid": "112.00",
            "totalDebts": "5"
        },
        "pinnedNotes": []
    }

      dispatch({ type: GET_CUR_PATIENT, currentPatient: data, payload: true })
    } catch (err) {
      throw new Error(err)
    } finally {
      dispatch(setLoaderAction(false))
    }
  }
}
