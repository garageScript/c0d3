const path = require('path')
const fs = require('fs')
const PNG = require('pngjs').PNG
const pixelmatch = require('pixelmatch')
const uuidv4 = require('uuid/v4')
const FormData = require('form-data')
const fetch = require('node-fetch')

const uuid = uuidv4()
const tmpIdFilePath = path.resolve(__dirname, `./tmp/uuid`)
fs.writeFile(tmpIdFilePath, uuid, () => {})

const takeScreenshot = (nemo, filename, update = false) => {
  return nemo.driver.takeScreenshot().then(data => {
    return new Promise((resolve, reject) => {
      const fullPath = path.resolve(__dirname, `./screenshots/${filename}.png`)
      const commitPath = path.resolve(__dirname, `./tmp/commit/${filename}.png`)

      fs.stat(fullPath, (err, fStat) => {
        if (update || err) return fs.writeFile(fullPath, data, { encoding: 'base64' }, resolve)

        fs.writeFile(commitPath, data, { encoding: 'base64' }, () => {
          const doneReading = () => {
            if (++filesRead < 2) return
            const diff = new PNG({ width: img1.width, height: img1.height })

            const numPix = pixelmatch(
              img1.data,
              img2.data,
              diff.data,
              img1.width,
              img1.height,
              { threshold: 0.1 }
            )

            const diffTolerance = 100

            if (numPix > diffTolerance) {
              const diffPath = path.resolve(__dirname, `./tmp/diff/${filename}.png`)

              diff.pack().pipe(fs.createWriteStream(diffPath)).on('finish', () => {
                const formData = new FormData()
                formData.append('original', fs.createReadStream(fullPath))
                formData.append('commit', fs.createReadStream(commitPath))
                formData.append('diff', fs.createReadStream(diffPath))
                formData.append('filename', filename)
                formData.append('uuid', uuid)
                fetch('https://blinkblink.c0d3.com/files', {
                  method: 'POST',
                  body: formData
                })
              })

              return reject(
                new Error(`Screenshot diff test failed! There are ${numPix} different pixels. See screenshot at https://blinkblink.c0d3.com/${uuid}`)
              )
            }
            resolve()
          }

          const img1 = fs
            .createReadStream(fullPath)
            .pipe(new PNG())
            .on('parsed', doneReading)

          let img2 = fs
            .createReadStream(commitPath)
            .pipe(new PNG())
            .on('parsed', doneReading)

          let filesRead = 0
        })
      })
    })
  })
}

module.exports = { takeScreenshot }
