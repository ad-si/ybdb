'use strict'

const fs = require('fs')
const path = require('path')

const Ybdb = require('../index.js')

{
	const db = new Ybdb()

	db.object.contacts = [
		{name: 'John', age: 45},
		{name: 'Anna', age: 34}
	]

	console.assert(
		db('contacts').find({name: 'Anna'}).age === 34,
		db('contacts').find({name: 'Anna'}).age + ' instead of 34'
	)
}

{
	const tempFile = path.join(__dirname, 'temp.yaml')
	const referenceFile = path.join(__dirname, 'reference.yaml')
	const asyncFileStorage = require('lowdb/file-async')

	function deleteTestFile () {
		try {
			fs.unlinkSync(tempFile)
		}
		catch (error) {}
	}

	function readFile (filePath) {
		return fs.readFileSync(filePath, 'utf-8')
	}


	deleteTestFile()

	const db = new Ybdb({
		storage: asyncFileStorage,
		storageFile: tempFile,
	})

	db('songs')
		.chain()
		.push({title: 'Song One'})
		.push({title: 'Another Song'})
		.push({title: 'The Song'})
		.value()
		.then(songs => {
			console.assert(
				readFile(tempFile) === readFile(referenceFile),
				readFile(tempFile) + ' should equal ' + readFile(referenceFile)
			)
			deleteTestFile()
		})
		.catch(console.error)
}
