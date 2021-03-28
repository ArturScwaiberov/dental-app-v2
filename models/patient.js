class Patient {
  constructor(id, fullName, phone, birthday, sex, totalInvoiced, totalDebts, appointments) {
    this.id = id
    this.fullName = fullName
    this.phone = phone
    this.birthday = birthday
    this.sex = sex
    this.totalInvoiced = totalInvoiced
    this.totalDebts = totalDebts
    this.appointments = appointments
  }
}

export default Patient
