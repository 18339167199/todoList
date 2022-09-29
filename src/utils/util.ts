export const getCurrentDateStr = (): string => {
  const date = new Date()
  return date.toLocaleString().replaceAll('/', '-')
}
