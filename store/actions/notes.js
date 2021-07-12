import axios from '../../core/axios'
import Note from '../../models/note'

export const GET_NOTES = 'GET_NOTES'
export const SET_NOTES = 'SET_NOTES'

const setLoaderAction = (payload) => ({
	type: 'SET_LOADER',
	payload,
})

export const getNotes = (token, id) => {
	return async (dispatch) => {
		dispatch(setLoaderAction(true))
		try {
			const { data } = await axios.get(`/patients/${id}/notes`, {
				headers: { authorization: token },
			})

			const loadedNotes = []
			for (const key in data) {
				const element = data[key]
				if (element.tag === 'ALERT') {
					loadedNotes.push(
						new Note(
							element.id,
							element.tag,
							element.data.text,
							element.isPinned,
							element.createdAt,
							element.createdCustomerId,
						),
					)
				}
			}

			dispatch({
				type: GET_NOTES,
				notes: loadedNotes.sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
				),
				payload: true,
			})
		} catch (err) {
			throw new Error(err)
		} finally {
			dispatch(setLoaderAction(false))
		}
	}
}

export const addNote = (token, patientId, text) => {
	return async (dispatch) => {
		dispatch(setLoaderAction(true))
		try {
			let payload = { tag: 'ALERT', data: { text: text } }
			const { data } = await axios.post(
				`/patients/${patientId}/notes`,
				payload,
				{
					headers: { authorization: token },
				},
			)
		} catch (err) {
			throw new Error(err)
		} finally {
			dispatch(setLoaderAction(false))
		}
	}
}
