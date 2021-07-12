import axios from '../../core/axios'

export default {
	get: (token, id) =>{
		return axios.get(`/patients/${id}/appointments`, {
			headers: { authorization: token },
		})
	},
	getAll: (token, startDate, endDate) =>
		axios.get(`/appointments/${startDate}/${endDate}`, {
			headers: { authorization: token },
		}),
	add: (token, data, id) =>
		axios.post(`/patients/${id}/appointments`, data, {
			headers: { authorization: token },
		}),
	addNoPatient: (token, data) =>
		axios.post(`/appointments`, data, {
			headers: { authorization: token },
		}),
	update: (id, values) => axios.patch('/appointments/update/' + id, values),
	getFreeSlots: (token, data) =>
		axios.get(
			`/appointments/freeSlots/${data.day}/${data.day}/${data.interval}`,
			{
				headers: { authorization: token },
			},
		),
	updateAppointment: (token, appointmentId, data) => axios.put(`/appointments/${appointmentId}`,data,{
		headers: { authorization: token },
	})
}
