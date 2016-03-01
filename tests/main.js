'use strict'

const fs = require('fs')
const path = require('path')

const Ybdb = require('../index.js')
const tempFile = path.join(__dirname, 'temp.yaml')
const referenceFile = path.join(__dirname, 'reference.yaml')


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

const db = new Ybdb({storageFile: tempFile})

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
