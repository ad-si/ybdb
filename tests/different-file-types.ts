import path from "path"
import expect from "unexpected"
import Ybdb from "../index.js"

const expectedData = {
  "file-types": [
    {
      name: "Bob Smith",
      birthday: "1989-05-29",
      company: "Work Corp",
      localId: "bob",
    },
    {
      name: "John Doe",
      birthday: new Date("1962-02-15"),
      company: "Good Corp",
      localId: "john",
    },
    // max.txt is ignored
  ],
}

async function runTest (): Promise<void> {
  process.stdout.write("Test different file types")

  const database = new Ybdb({
    storagePath: path.join(import.meta.dirname, "fixtures/file-types"),
  })
  const initializedDb = await database.init()

  expect(initializedDb.data, "to equal", expectedData)
  console.info(" ✔︎")
}

runTest()
