const express = require('express')
const router = express.Router({ mergeParams: true })

const llHelpers = require('./ll.js')
const treeHelpers = require('./tree.js')
const styles = require('./styles.js')

const sanitizeData = data => {
  const input = data.replace(/^\s+|\s+$/g, '') // replace trailing/leading spaces
  try {
    return !input || (input[0] !== '[' && input[0] !== '{')
      ? ''
      : JSON.parse(input)
  } catch (e) {
    return ''
  }
}

const svgContainer = (width, height, svgStr) => {
  return `<svg xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    width="${width}"
    height="${height}">
      ${svgStr}
    </svg>`
}

const errorImage = `
  <g transform="translate(${styles.circle.radius},${styles.circle.radius})">
    <text fill="#ababab">No image could be generated</text>
  </g>
  <g transform="translate(${styles.circle.radius},${styles.circle.radius +
  20})">
    <text fill="#ababab">Please check your input and try again</text>
  </g>
`

const drawLL = data => {
  const input = sanitizeData(data)
  if (!input) return svgContainer(300, 60, errorImage)

  const { width, height, svgStr } = llHelpers.drawLL(input)
  return svgContainer(width, height, svgStr)
}

const drawTree = data => {
  const treeInput = sanitizeData(data)
  if (!treeInput) return svgContainer(300, 60, errorImage)

  const { width, height, svgStr } = treeHelpers.drawTree(treeInput)
  return svgContainer(width, height, svgStr)
}

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml')
  if (req.query.tree) return res.send(drawTree(req.query.tree))
  if (req.query.ll) return res.send(drawLL(req.query.ll))
})

module.exports = router
