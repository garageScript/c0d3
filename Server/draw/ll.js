const styles = require('./styles.js');

const drawLL = (
  n,
  canvasStyle = {
    top: styles.circle.radius,
    left: 0
  },
  map = {},
  svgStr = ''
) => {
  if (!n)
    return {
      width: canvasStyle.left + 2,
      height: canvasStyle.top + styles.circle.radius + 2,
      svgStr
    };

  // Circular Linked List
  if (typeof n !== 'object' && n) {
    const pNode = map[n];
    const lineY =
      canvasStyle.top + styles.circle.radius + styles.spacing.vertical;
    svgStr += `
      <line x1="${canvasStyle.left}" y1="${canvasStyle.top}" x2="${
      canvasStyle.left
    }" y2="${lineY}" style="stroke:rgba(255,0,0,0.5); stroke-width:2"></line>
      <line x1="${canvasStyle.left}" y1="${lineY}" x2="${
      pNode.left
    }" y2="${lineY}" style="stroke:rgba(255,0,0,0.5); stroke-width:2"></line>
      <line x1="${pNode.left}" y1="${lineY}" x2="${
      pNode.left
    }" y2="${canvasStyle.top +
      styles.circle
        .radius}" style="stroke:rgba(255,0,0,0.5); stroke-width:2"></line>
        `;
    canvasStyle.top += styles.spacing.vertical;
    return drawLL(null, canvasStyle, map, svgStr);
  }

  // Normal node
  canvasStyle.left += styles.circle.radius;
  map[n.v] = {
    left: canvasStyle.left
  };
  svgStr += `
  <g transform="translate(${canvasStyle.left},${canvasStyle.top})">
    <circle r="${styles.circle.radius}" color="${styles.circle.color}" fill="${
    styles.circle.fill
  }"></circle>
    <text text-anchor="middle" dominant-baseline="central" fill="${
      styles.text.color
    }">${n.v}</text>
  </g>`;

  canvasStyle.left += styles.circle.radius;
  if (n.next || n === 0) {
    svgStr += `
          <line x1="${canvasStyle.left}" y1="${
      canvasStyle.top
    }" x2="${canvasStyle.left + styles.spacing.horizontal}" y2="${
      canvasStyle.top
    }" style="stroke:rgba(255,0,0,0.5); stroke-width:2"></line>
        `;
    canvasStyle.left += styles.spacing.horizontal;
  }
  return drawLL(n.next, canvasStyle, map, svgStr);
};

module.exports = {
  drawLL
};
