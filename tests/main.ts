import expect from "unexpected"
import Ybdb from "../index"

async function runTest (): Promise<void> {
  process.stdout.write("Main test")
  const database = new Ybdb()
  const initializedDb = await database.init()

  initializedDb.data = {
    contacts: [
      { name: "John", age: 45 },
      { name: "Anna", age: 34 },
    ],
  }
  await initializedDb.write()

  type Contact = { name: string; age: number }
  const data = initializedDb.data as { contacts: Contact[] }
  const retrievedAge = data
    .contacts
    .find(contact => contact.name === "Anna")!
    .age

  expect(retrievedAge, "to equal", 34)
  console.info(" ✔︎")
}

runTest()
