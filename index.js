const { PassThrough } = require('stream') 

const pass = new PassThrough()

module.exports = parsers => {
  if (!Array.isArray(parsers)) {
    throw new TypeError('argument to multiparser should be an array.')
  }

  pass.parsers = parsers
  parsers.forEach(( parser, i ) => {
    pass.pipe(parser)

    parser.on('error', () => {
      pass.parsers = parsers.filter(_parser => _parser !== parser)
    })
  })

  return pass
}
