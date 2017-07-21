const path = require('path')
const expect = require('unexpected')
const Ybdb = require('../index.js')
const expectedData = {
  'file-types': [
    {
      name: 'Bob Smith',
      birthday: '1989-05-29',
      company: 'Work Corp',
      localId: 'bob',
    },
    {
      name: 'John Doe',
      birthday: new Date('1962-02-15'),
      company: 'Good Corp',
      localId: 'john',
    },
    // max.txt is ignored
  ],
}

async function runTest () {
  process.stdout.write('Test different file types')

  const database = new Ybdb({
    storagePath: path.join(__dirname, 'fixtures/file-types'),
  })
  const initializedDb = await database.init()

  expect(initializedDb.getState(), 'to equal', expectedData)
  console.info(' ✔︎')
}

runTest()
