/* global describe, it */
const snapShot = require('./snapshot')

describe('@trivial@', function () {
  it('landing page', async function () {
    let nemo = this.nemo
    let { baseUrl } = nemo.data
    await nemo.driver.get(baseUrl)
    await snapShot.takeScreenshot(nemo, 'landingpage')
  })
})
