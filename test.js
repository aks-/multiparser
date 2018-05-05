const assert = require('assert')
const { PassThrough, Readable } = require('stream')
const multiparser = require('./')

const testInputArguments = () => {
  assert.throws(
    () => { multiparser({}) },
    /^TypeError: argument to multiparser should be an array.$/
  )

  assert.throws(
    () => { multiparser() },
    /^TypeError: argument to multiparser should be an array.$/
  )
}

const getParsers = () => {
  const parser1 = new PassThrough()
  const parser2 = new PassThrough()
  const parser3 = new PassThrough()

  return [
    parser1,
    parser2,
    parser3
  ]
}

const getReadableStream = () => {
  const rs = new Readable()
  rs.push('beep ')
  rs.push('boop\n')
  rs.push(null)

  return rs
}

const shouldWorkWithMultipleParsers = () => {
  const parsers = getParsers()

  const rs = getReadableStream()
  const ws = multiparser(parsers)
  rs.pipe(ws)

  assert.ok(ws.parsers.length, 3)
}

const shouldRemoveParserThatErrored = () => {
  const parsers = getParsers()

  const rs = getReadableStream()
  const ws = multiparser(parsers)

  rs.pipe(ws)
  parsers[1].emit('error', new Error())

  assert.ok(ws.parsers.length, 2)
}

testInputArguments()
shouldWorkWithMultipleParsers()
shouldRemoveParserThatErrored() 
