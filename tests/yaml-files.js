const path = require('path')
const assert = require('assert')

const Ybdb = require('../index.js')
const dbPromise = new Ybdb({
  storagePath: path.join(__dirname, 'yaml-files'),
})
const expectedData = {
  companies: [
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
  ],
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

dbPromise
  .then(db => db.read())
  .then(lowsdashChain => lowsdashChain.value())
  .then(data => {
    assert.deepEqual(data, expectedData)
    console.info('Yaml-files test succeeded ✔︎')
  })
  .catch(console.error)
