import fs from "fs"
import path from "path"
import expect from "unexpected"

import Ybdb from "../index.js"

const tempFile = path.join(import.meta.dirname, "temp.yaml")
const referenceFile = path.join(import.meta.dirname, "reference.yaml")

function deleteTestFile (): void {
  try {
    fs.unlinkSync(tempFile)
  }
  catch (error) {
    const err = error as NodeJS.ErrnoException
    if (!err.message.includes("no such file")) console.error(err)
  }
}

function readFile (filePath: string): string {
  return fs.readFileSync(filePath, "utf-8")
}

deleteTestFile()

async function runTest (): Promise<void> {
  process.stdout.write("YAML file writing test")

  const database = new Ybdb({
    storageFile: tempFile,
  })
  const initializedDb = await database.init()

  initializedDb.data = { songs: [] as { title: string }[] }
  await initializedDb.write()

  const data = initializedDb.data as { songs: { title: string }[] }
  data.songs.push({ title: "Song One" })
  data.songs.push({ title: "Another Song" })
  data.songs.push({ title: "The Song" })
  await initializedDb.write()

  expect(data.songs, "to have length", 3)
  expect(readFile(tempFile), "to equal", readFile(referenceFile))
  deleteTestFile()
  console.info(" ✔︎")
}

runTest()
