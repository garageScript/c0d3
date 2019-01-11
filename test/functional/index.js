const express = require('express')
const app = express()
const directory = require('serve-index')

app.use(directory(`${__dirname}/`))
app.use(express.static(`${__dirname}/`))

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen(4632)
