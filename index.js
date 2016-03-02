'use strict'

const lowdb = require('lowdb')
const yaml = require('js-yaml')

const asyncFileStorage = require('lowdb/file-async')

const yamlFormat = {
	serialize: yaml.safeDump,
	deserialize: yaml.safeLoad,
}

const defaultConfig = {
	storage: asyncFileStorage,
	format: yamlFormat,
	writeOnChange: true,
	databaseName: 'ybdb',
}

module.exports = class Ybdb {
	constructor (configObject) {
		configObject = Object.assign(
			{},
			defaultConfig,
			configObject
		)

		return lowdb(
			configObject.storageFile || configObject.databaseName,
			configObject,
			configObject.writeOnChange
		)
	}
}
