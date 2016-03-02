'use strict'

const lowdb = require('lowdb')
const yaml = require('js-yaml')


const yamlFormat = {
	serialize: yaml.safeDump,
	deserialize: yaml.safeLoad,
}

const defaultConfig = {
	format: yamlFormat,
	writeOnChange: true,
	databaseName: 'ybdb',
}

module.exports = class Ybdb {
	constructor (configObject) {

		if (!configObject) {
			return lowdb()
		}

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
