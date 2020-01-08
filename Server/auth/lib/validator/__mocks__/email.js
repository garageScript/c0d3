const isEmailAvailable = jest.fn(_ => {
  return new Promise((resolve, reject) => {
    resolve([])
  })
})

module.exports = isEmailAvailable
