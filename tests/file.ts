import path from "path"
import expect from "unexpected"
import Ybdb from "../index.js"

const expectedData = {
  contacts: [
    {
      name: "John Doe",
      birthday: new Date("1962-02-15"),
      company: "Good Corp",
    },
    {
      name: "Anna Smith",
      birthday: new Date("1978-08-22"),
      company: "Evil Corp",
    },
  ],
}

async function runTest (): Promise<void> {
  process.stdout.write("YAML file test")
  const database = new Ybdb({
    storagePath: path.join(import.meta.dirname, "fixtures/contacts.yaml"),
  })

  const initializedDb = await database.init()

  expect(initializedDb.data, "to equal", expectedData)
  console.info(" ✔︎")
}

runTest()
