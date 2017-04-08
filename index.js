const path = require('path')
const lowdb = require('lowdb')
const yaml = require('js-yaml')
const fsp = require('fs-promise')

const yamlFilesStorage = {
  read: (storagePath, deserialize) => {
    return fsp
      .readdir(storagePath)
      .then(filePaths => filePaths
        .map(filePath => {
          return fsp
            .readFile(path.join(storagePath, filePath))
            .then(fileContent => ({
              content: deserialize(fileContent),
              path: filePath,
              basename: path.basename(filePath, path.extname(filePath)),
            }))
        })
      )
      .then(filePromises => Promise.all(filePromises))
      .then(fileObjects => {
        return fileObjects
          .reduce(
            (dataBase, fileObject) => {
              dataBase[fileObject.basename] = fileObject.content
              return dataBase
            },
            {}
          )
      })
  },
  // write: (destionation, data) => {
  //   console.log(data)
  // },
}

const yamlFilesFormat = {
  serialize: yaml.safeDump,
  deserialize: yaml.safeLoad,
}

const yamlFormat = {
  deserialize: yaml.safeLoad,
  serialize: yaml.safeDump,
}

const defaultConfig = {
  format: yamlFormat,
  databaseName: 'ybdb',
  storagePath: null,
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

    if (configObject.storagePath) {
      configObject.storage = yamlFilesStorage
      configObject.format = yamlFilesFormat

      return lowdb(configObject.storagePath, configObject)
    }

    return lowdb(
      configObject.storageFile || configObject.databaseName,
      configObject
    )
  }
}
