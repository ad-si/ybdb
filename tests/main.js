const assert = require('assert')
const Ybdb = require('../index.js')

async function runTest () {
  const database = new Ybdb()
  const initializedDb = await database.init()

  initializedDb
    .defaults({
      contacts: [
        {name: 'John', age: 45},
        {name: 'Anna', age: 34},
      ],
    })
    .write()

  const retrievedAge = initializedDb
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
}

runTest()
