const path = require('path')
const assert = require('assert')
const Ybdb = require('../index.js')
const expectedData = {
  contacts: [
    {
      name: 'John Doe',
      birthday: new Date('1962-02-15'),
      company: 'Good Corp',
    },
    {
      name: 'Anna Smith',
      birthday: new Date('1978-08-22'),
      company: 'Evil Corp',
    },
  ],
}

async function runTest () {
  const database = new Ybdb({
    storagePath: path.join(__dirname, 'fixtures/contacts.yaml'),
  })
  const initializedDb = await database.init()

  assert.deepEqual(initializedDb.getState(), expectedData)
  console.info('YAML file test succeeded ✔︎')
}

runTest()
