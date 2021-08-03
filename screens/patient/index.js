import { Container, DefaultTabBar, Tab, Tabs } from 'native-base'
import React from 'react'
import Modal from 'react-native-modal'
import { useDispatch, useSelector } from 'react-redux'

import * as notesActions from '../../store/actions/notes'
import * as patientsActions from '../../store/actions/patients'
import * as commonActions from '../../store/actions/common'
import { appointmentsApi, patientsApi } from '../../utils'
import ActionButtons from './components/ActionButtons'
import AddNoteForm from './components/AddNoteForm'
import AppointmentsTab from './components/AppointmentsTab'
import CreateInvoice from './components/CreateInvoice'
import InvoicesTab from './components/InvoicesTab'
import Loader from './components/Loader'
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

  const patientLoading = useSelector((state) => state.patients.patientLoading)
  const appointments = useSelector((state) => state.patients.appointments)
  const invoices = useSelector((state) => state.patients.invoices)

  const [isAddNote, setIsAddNote] = React.useState(false)
  const showAddNote = () => setIsAddNote(true)
  const hideAddNote = () => setIsAddNote(false)

  const [isPayment, setIsPayment] = React.useState(false)
  const showPayment = () => setIsPayment(true)
  const hidePayment = () => setIsPayment(false)

  const [isCreateInvoice, setIsCreateInvoice] = React.useState(false)
  const showCreateInvoice = () => setIsCreateInvoice(true)
  const hideCreateInvoice = () => setIsCreateInvoice(false)

  const dispatch = useDispatch()

  // const fetchAppointments = async () => {
  //   const { data: appointments } = await appointmentsApi.get(token, patientId)
  //   setAppointments(appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  // }

  const fetchPatient = async () => {
    await dispatch(patientsActions.fetchAppointments(token, patientId))

    await dispatch(patientsActions.getPatient(token, patientId))
  }

  const fetchCommons = async () => {
    await dispatch(commonActions.getCommon(token))
  }

  const fetchNotes = async () => {
    await dispatch(notesActions.getNotes(token, patientId))
  }

  const fetchInvoices = async () => {
    await dispatch(patientsActions.fetchInvoices(token, patientId))
  }

  React.useEffect(() => {
    ;(async () => {
      dispatch(patientsActions.setPatientLoading(true))
      await fetchCommons()
      await fetchPatient()
      await fetchInvoices()
      dispatch(patientsActions.setPatientLoading(false))
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
    await appointmentsApi.updateAppointment(token, appointment.id, appointment)

    await dispatch(patientsActions.fetchAppointments(token, patientId))

    cb && cb()
  }

  const onUpdateCreateInvoice = async () => {
    await fetchInvoices()
    await dispatch(patientsActions.getPatient(token, patientId))
  }

  if (patientLoading) {
    return <Loader loading={true} />
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
          <InvoicesTab invoices={invoices} common={common} onUpdate={fetchInvoices} />
        </Tab>
      </Tabs>

      <Modal isVisible={isAddNote} onBackdropPress={hideAddNote}>
        <AddNoteForm onCreate={createNote} onClose={hideAddNote} />
      </Modal>

      <Modal isVisible={isPayment} onBackdropPress={hidePayment}>
        <PaymentForm
          token={token}
          patient={currentPatient}
          onClose={hidePayment}
          onUpdate={fetchInvoices}
        />
      </Modal>

      <Modal isVisible={isCreateInvoice} onBackdropPress={hideCreateInvoice}>
        <CreateInvoice
          patient={currentPatient}
          onClose={hideCreateInvoice}
          onUpdate={onUpdateCreateInvoice}
        />
      </Modal>
    </Container>
  )
}

export default Patient
