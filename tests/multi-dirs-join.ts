import path from "path"
import expect from "unexpected"
import Ybdb from "../index.js"

const expectedData = [
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
]

async function runTest (): Promise<void> {
  process.stdout.write("Join multiple YAML file trees")

  const database = new Ybdb({
    storagePaths: [
      path.join(import.meta.dirname, "fixtures/contact-dirs"),
      path.join(import.meta.dirname, "fixtures/contact-files"),
    ],
    joined: true,
  })
  const initializedDb = await database.init()

  expect(initializedDb.data, "to equal", expectedData)
  console.info(" ✔︎")
}

runTest()
