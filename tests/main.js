const assert = require('assert')
const Ybdb = require('../index.js')

const db = new Ybdb()

db
  .defaults({
    contacts: [
      {name: 'John', age: 45},
      {name: 'Anna', age: 34},
    ],
  })
  .write()

const retrievedAge = db
  .get('contacts')
  .find({name: 'Anna'})
  .value()
  .age

assert.equal(
  retrievedAge,
  34,
  `${retrievedAge} instead of 34`
)

console.info('Main test succeeded ✔︎')
