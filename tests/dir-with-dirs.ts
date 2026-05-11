import path from "path"
import expect from "unexpected"
import Ybdb from "../index"

const expectedData = {
  "contact-dirs": [
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
  process.stdout.write("Directories test")

  const database = new Ybdb({
    storagePath: path.join(__dirname, "fixtures/contact-dirs"),
  })
  const initializedDb = await database.init()

  expect(initializedDb.data, "to equal", expectedData)
  console.info(" ✔︎")
}

runTest()
