const minimist = require('minimist')

module.exports = (args = process.argv) => {
  execute(getInputs(args))
}

function getInputs(args) {
  return minimist(args.slice(2))
}

function execute(inputs) {
  const command = inputs._[0]

  try {
    // TO-DO: Add local computer capability
    require(`./cmd/${command}`)(inputs)
  } catch (e) {
    console.error(`"${command}" is not a valid command`)
  }
}
