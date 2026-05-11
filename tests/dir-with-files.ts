import path from "path"
import expect from "unexpected"
import Ybdb from "../index"

const expectedData = {
  "contact-files": [
    {
      name: "Anna Smith",
      birthday: new Date("1978-08-22"),
      company: "Evil Corp",
      localId: "anna",
    },
    {
      name: "John Doe",
      birthday: new Date("1962-02-15"),
      company: "Good Corp",
      localId: "john",
    },
  ],
}

async function runTest (): Promise<void> {
  process.stdout.write("YAML files test")

  const database = new Ybdb({
    storagePath: path.join(__dirname, "fixtures/contact-files"),
  })
  const initializedDb = await database.init()

  expect(initializedDb.data, "to equal", expectedData)
  console.info(" ✔︎")
}

runTest()
