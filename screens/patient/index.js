import { Container, DefaultTabBar, Tab, Tabs } from 'native-base'
import React, { useEffect, useState } from 'react'
import Modal from 'react-native-modal'
import { useDispatch, useSelector } from 'react-redux'
import * as notesActions from '../../store/actions/notes'
import * as patientsActions from '../../store/actions/patients'
import { appointmentsApi, patientsApi } from '../../utils'
import ActionButtons from './components/ActionButtons'
import AddNoteForm from './components/AddNoteForm'
import AppointmentsTab from './components/AppointmentsTab'
import CreateInvoice from './components/CreateInvoice'
import InvoicesTab from './components/InvoicesTab'
import NotesTab from './components/NotesTab'
import PatientDetail from './components/PatientDetail'
import PaymentForm from './components/PaymentForm'
import Spacer from './components/Spacer'

const Patient = ({ route, navigation }) => {
	const { patientId } = route.params

	const token = useSelector((state) => state.auth.token)
	const currentPatient = useSelector((state) => state.patients.currentPatient)
	const notes = useSelector((state) => state.notes.notes)
	const common = useSelector((state) => state.common)

	const [patientLoading, setPatientLoading] = useState(true)
	const [appointments, setAppointments] = useState()
	const [invoices, setInvoices] = useState()
	const [invoiceTotal, setInvoiceTotal] = useState({ total: 0, paid: 0 })

	const [isAddNote, setIsAddNote] = useState(false)
	const showAddNote = () => setIsAddNote(true)
	const hideAddNote = () => setIsAddNote(false)

	const [isPayment, setIsPayment] = useState(false)
	const showPayment = () => setIsPayment(true)
	const hidePayment = () => setIsPayment(false)

	const [isCreateInvoice, setIsCreateInvoice] = useState(false)
	const showCreateInvoice = () => setIsCreateInvoice(true)
	const hideCreateInvoice = () => setIsCreateInvoice(false)

	const dispatch = useDispatch()

	const fetchAppointments = async () => {
		const { data: appointments } = await appointmentsApi.get(
			token,
			patientId,
		)
		setAppointments(
			appointments.sort(
				(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
			),
		)
	}

	const fetchPatient = async () => {
		setPatientLoading(true)

		await fetchAppointments()

		await dispatch(patientsActions.getPatient(token, patientId))

		setPatientLoading(false)
	}

	const fetchNotes = async () => {
		await dispatch(notesActions.getNotes(token, patientId))
	}

	const fetchInvoices = async () => {
		const { data } = await patientsApi.getInvoices(token, patientId)
		setInvoices(
			data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
		)

		const { total, paid } = data.reduce(
			(a, invoice) => {
				a['total'] += parseFloat(invoice.totalAmount)
				a['paid'] += parseFloat(invoice.paidAmount)
				return a
			},
			{
				total: 0,
				paid: 0,
			},
		)

		setInvoiceTotal({
			total,
			paid,
		})
	}

	useEffect(() => {
		;(async () => {
			await fetchPatient()
			await fetchInvoices()
		})()
	}, [])

	const renderTabBar = (props) => {
		props.tabStyle = Object.create(props.tabStyle)
		return <DefaultTabBar {...props} />
	}

	const deleteNote = async (noteId) => {
		await patientsApi.deleteNote(token, patientId, noteId)
		await fetchNotes()
	}

	const createNote = async (note) => {
		await dispatch(notesActions.addNote(token, patientId, note))
		await fetchNotes()
		hideAddNote()
	}

	const updateAppointment = async (appointment, cb) => {
		await appointmentsApi.updateAppointment(
			token,
			appointment.id,
			appointment,
		)

		await fetchAppointments()

		cb && cb()
	}

	return (
		<Container>
			<Spacer value={10} />
			<PatientDetail patient={currentPatient} />

			<ActionButtons
				patient={currentPatient}
				onAddNote={showAddNote}
				onPayment={showPayment}
				onCreateInvoice={showCreateInvoice}
			/>

			<Tabs
				locked
				renderTabBar={renderTabBar}
				tabBarUnderlineStyle={{ backgroundColor: '#2A86FF' }}
			>
				<Tab
					heading='Appointments'
					tabStyle={{ backgroundColor: 'white' }}
					activeTabStyle={{
						backgroundColor: 'white',
					}}
					textStyle={{
						color: '#2A86FF',
						fontSize: 16,
						fontWeight: 'bold',
					}}
					activeTextStyle={{
						color: '#2A86FF',
						fontSize: 16,
						fontWeight: 'bold',
					}}
				>
					<AppointmentsTab
						patient={currentPatient}
						appointments={appointments}
						common={common}
						onUpdateAppointment={updateAppointment}
					/>
				</Tab>
				<Tab
					heading='Notes'
					tabStyle={{ backgroundColor: 'white' }}
					activeTabStyle={{
						backgroundColor: 'white',
					}}
					textStyle={{
						color: '#2A86FF',
						fontSize: 16,
						fontWeight: 'bold',
					}}
					activeTextStyle={{
						color: '#2A86FF',
						fontSize: 16,
						fontWeight: 'bold',
					}}
				>
					<NotesTab
						notes={notes}
						common={common}
						patientId={patientId}
						onFetch={fetchNotes}
						onDeleteNote={deleteNote}
					/>
				</Tab>
				<Tab
					heading='Invoices'
					tabStyle={{ backgroundColor: 'white' }}
					activeTabStyle={{
						backgroundColor: 'white',
					}}
					textStyle={{
						color: '#2A86FF',
						fontSize: 16,
						fontWeight: 'bold',
					}}
					activeTextStyle={{
						color: '#2A86FF',
						fontSize: 16,
						fontWeight: 'bold',
					}}
				>
					<InvoicesTab
						invoices={invoices}
						common={common}
						onUpdate={fetchInvoices}
					/>
				</Tab>
			</Tabs>

			<Modal isVisible={isAddNote} onBackdropPress={hideAddNote}>
				<AddNoteForm onCreate={createNote} onClose={hideAddNote} />
			</Modal>

			<Modal isVisible={isPayment} onBackdropPress={hidePayment}>
				<PaymentForm
					token={token}
					patient={currentPatient}
					invoiceTotal={invoiceTotal}
					onClose={hidePayment}
				/>
			</Modal>

			<Modal
				isVisible={isCreateInvoice}
				onBackdropPress={hideCreateInvoice}
			>
				<CreateInvoice
					patient={currentPatient}
					onClose={hideCreateInvoice}
					onUpdate={fetchInvoices}
				/>
			</Modal>
		</Container>
	)
}

export default Patient
