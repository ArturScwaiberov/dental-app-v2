export default (str) => {
  return str.split('').reduce((result, n) => {
    return result.replace('X', n)
  }, '+1(XXX)XXX-XXXX')
}
