const fs = require('fs')
const path = require('path')
const assert = require('assert')

const Ybdb = require('../index.js')


const tempFile = path.join(__dirname, 'temp.yaml')
const referenceFile = path.join(__dirname, 'reference.yaml')
const asyncFileStorage = require('lowdb/lib/storages/file-async')

function deleteTestFile () {
  try {
    fs.unlinkSync(tempFile)
  }
  catch (error) {
    if (!error.message.includes('no such file')) console.error(error)
  }
}

function readFile (filePath) {
  return fs.readFileSync(filePath, 'utf-8')
}

deleteTestFile()

const db = new Ybdb({
  storage: asyncFileStorage,
  storageFile: tempFile,
})

db
  .defaults({
    songs: [],
  })
  .write()

db
  .get('songs')
  .push({title: 'Song One'})
  .push({title: 'Another Song'})
  .push({title: 'The Song'})
  .write()
  .then(songs => {
    assert(songs)
    assert(
      readFile(tempFile) === readFile(referenceFile),
      readFile(tempFile) + ' should equal ' + readFile(referenceFile)
    )
    deleteTestFile()
    console.info('Yaml-file test succeeded ✔︎')
  })
  .catch(console.error)
