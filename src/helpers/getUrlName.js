const _ = require('lodash')

const getUrlName = name => _
  .chain()
  .lowerCase()
  .kebabCase(name)
  .value()

module.exports = getUrlName
