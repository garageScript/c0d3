const styles = require('./styles.js')

/**
 * TREE HELPERS
 */
// Build tree by levels
const buildTreeArr = (arr, nextLevel = [], result) => {
  if (!arr.length && !nextLevel.length) return result
  if (!arr.length) {
    if (nextLevel.length > result.maxWidthNodes) {
      result.maxWidthNodes = nextLevel.length
    }
    result.treeData.push(nextLevel.slice())
    return buildTreeArr(nextLevel, [], result)
  }
  const n = arr.shift()
  const children = n.children || []
  children.forEach(e => {
    e.id = result.nodeStyles.push({}) - 1
    e.parent = n.id
    return e
  })
  return buildTreeArr(arr, nextLevel.concat(children), result)
}

const drawTree = treeInput => {
  treeInput.id = 0
  const { maxWidthNodes, treeData, nodeStyles } = buildTreeArr(
    [treeInput],
    [],
    {
      maxWidthNodes: 1,
      treeData: [[{ v: treeInput.v, id: treeInput.id }]],
      nodeStyles: [{}]
    }
  )

  const width =
    maxWidthNodes * styles.circle.diameter +
    (maxWidthNodes - 1) * styles.spacing.horizontal
  const height =
    treeData.length * styles.circle.diameter +
    (treeData.length - 1) * styles.spacing.vertical

  // drawing!
  let svgStr = ''
  const canvasStyle = {
    top: styles.circle.radius,
    left: Math.floor(width / 2)
  }

  treeData.forEach(lev => {
    let separator = Math.floor(width / (lev.length + 1))

    // If longest level of tree, start from all the way left
    if (lev.length === maxWidthNodes) {
      canvasStyle.left = styles.circle.radius
      separator = styles.circle.diameter + styles.spacing.horizontal
    } else {
      canvasStyle.left = separator
    }

    lev.forEach(n => {
      // For future reference, g translation is g's center point (like a circle's cx and cy)
      // Text SVG: dominant-baseline for vertical centering, text-anchor for horizontal centering
      svgStr += `
      <g transform="translate(${canvasStyle.left},${canvasStyle.top})">
        <circle r="${styles.circle.radius}"
          color="${styles.circle.color}"
          fill="${styles.circle.fill}"></circle>
        <text text-anchor="middle"
          dominant-baseline="central"
          fill="${styles.text.color}">${n.v}</text>
      </g>`
      nodeStyles[n.id] = {
        top: canvasStyle.top,
        left: canvasStyle.left
      }

      const parent = nodeStyles[n.parent]
      if (parent) {
        svgStr += `
          <line x1="${canvasStyle.left}"
            y1="${canvasStyle.top - styles.circle.radius}"
            x2="${parent.left}" y2="${parent.top + styles.circle.radius}"
            style="stroke:rgba(255,0,0,0.5); stroke-width:2"></line>
        `
      }
      canvasStyle.left += separator
    })
    canvasStyle.top += styles.circle.diameter + styles.spacing.vertical
  })
  return { width, height, svgStr }
}

module.exports = {
  drawTree
}
