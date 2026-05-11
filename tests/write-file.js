const fs = require("fs")
const path = require("path")
const expect = require("unexpected")

const Ybdb = require("../index.js")


const tempFile = path.join(__dirname, "temp.yaml")
const referenceFile = path.join(__dirname, "reference.yaml")

function deleteTestFile () {
  try {
    fs.unlinkSync(tempFile)
  }
  catch (error) {
    if (!error.message.includes("no such file")) console.error(error)
  }
}

function readFile (filePath) {
  return fs.readFileSync(filePath, "utf-8")
}

deleteTestFile()


async function runTest () {
  process.stdout.write("YAML file writing test")

  const database = new Ybdb({
    storageFile: tempFile,
  })
  const initializedDb = await database.init()

  initializedDb.data = { songs: [] }
  await initializedDb.write()

  initializedDb.data.songs.push({title: "Song One"})
  initializedDb.data.songs.push({title: "Another Song"})
  initializedDb.data.songs.push({title: "The Song"})
  await initializedDb.write()

  expect(initializedDb.data.songs, "to have length", 3)
  expect(readFile(tempFile), "to equal", readFile(referenceFile))
  deleteTestFile()
  console.info(" ✔︎")
}

runTest()
