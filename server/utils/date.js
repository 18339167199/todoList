const getCurrentDateStr = () => {
  const date = new Date()
  return date.toLocaleString().replaceAll('/', '-')
}

module.exports = {
  getCurrentDateStr
}