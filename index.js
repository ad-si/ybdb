'use strict'

const lowdb = require('lowdb')
const yaml = require('js-yaml')

const storage = require('lowdb/file-async')

const yamlFormat = {
	serialize: yaml.safeDump,
	deserialize: yaml.safeLoad
}

module.exports = class Ybdb {
	constructor (configObject) {
		console.assert(configObject.storageFile)

		return lowdb(configObject.storageFile, {
			storage,
			format: yamlFormat
		})
	}
}
