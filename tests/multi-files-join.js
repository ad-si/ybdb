const path = require('path')
const expect = require('unexpected')
const Ybdb = require('../index.js')
const expectedData = [
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
  {
    name: 'Good Corp',
    'founding-date': new Date('1912-09-05'),
    'number of employees': 15,
  },
  {
    name: 'Evil Corp',
    'founding-date': new Date('1933-04-19'),
    'number of employees': 65,
  },
]

async function runTest () {
  process.stdout.write('Join multiple YAML files')

  const database = new Ybdb({
    storagePaths: [
      path.join(__dirname, 'fixtures/contacts.yaml'),
      path.join(__dirname, 'fixtures/companies.yaml'),
    ],
    joined: true,
  })
  const initializedDb = await database.init()

  expect(initializedDb.getState(), 'to equal', expectedData)
  console.info(' ✔︎')
}

runTest()
