class Patient {
  constructor(id, fullName, phone, birthday, sex, totalInvoiced, totalDebts, appointments, avatar) {
    this.id = id
    this.fullName = fullName
    this.phone = phone
    this.birthday = birthday
    this.sex = sex
    this.totalInvoiced = totalInvoiced
    this.totalDebts = totalDebts
    this.appointments = appointments
    this.avatar = avatar
  }
}

export default Patient
