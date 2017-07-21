const path = require('path')
const expect = require('unexpected')
const Ybdb = require('../index.js')
const expectedData = [
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
]

async function runTest () {
  process.stdout.write('Join multiple YAML file trees')

  const database = new Ybdb({
    storagePaths: [
      path.join(__dirname, 'fixtures/contact-dirs'),
      path.join(__dirname, 'fixtures/contact-files'),
    ],
    joined: true,
  })
  const initializedDb = await database.init()

  expect(initializedDb.getState(), 'to equal', expectedData)
  console.info(' ✔︎')
}

runTest()
