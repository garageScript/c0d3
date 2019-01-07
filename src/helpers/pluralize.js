const pluralize = (str, count) => {
  const suffix = count > 1 ? 's' : ''
  return `${str}${suffix}`
}

export default pluralize
