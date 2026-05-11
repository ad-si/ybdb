const expect = require("unexpected")
const Ybdb = require("../index.js")

async function runTest () {
  process.stdout.write("Main test")
  const database = new Ybdb()
  const initializedDb = await database.init()

  initializedDb.data = {
    contacts: [
      {name: "John", age: 45},
      {name: "Anna", age: 34},
    ],
  }
  await initializedDb.write()

  const retrievedAge = initializedDb
    .data
    .contacts
    .find(contact => contact.name === "Anna")
    .age

  expect(retrievedAge, "to equal", 34)
  console.info(" ✔︎")
}

runTest()
