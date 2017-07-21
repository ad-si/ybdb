const path = require('path')
const expect = require('unexpected')
const expectedData = {
  'contact-dirs': [
    {
      name: 'Anna Smith',
      birthday: new Date('1978-08-22'),
      company: 'Evil Corp',
      localId: 'anna',
    },
    {
      name: 'John Doe',
      birthday: new Date('1962-02-15'),
      company: 'Good Corp',
      localId: 'john',
    },
  ],
}

async function runTest () {
  process.stdout.write('Directories test')

  const Ybdb = require('../index.js')
  const database = new Ybdb({
    storagePath: path.join(__dirname, 'fixtures/contact-dirs'),
  })
  const initializedDb = await database.init()
  const data = initializedDb.getState()

  expect(data, 'to equal', expectedData)
  console.info(' ✔︎')
}

runTest()
