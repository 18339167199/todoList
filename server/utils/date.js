/**
 * 获取当前时间的字符串 yyyy-MM-dd hh:mm:ss
 * @returns string
 */
const getCurrentDateStr = () => {
  const date = new Date()
  return date.toLocaleString().replaceAll('/', '-')
}

module.exports = {
  getCurrentDateStr
}