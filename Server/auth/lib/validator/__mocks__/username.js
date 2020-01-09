const isAvailable = jest.fn(() => {
  return new Promise((resolve, reject) => resolve(true))
})

module.exports = isAvailable
