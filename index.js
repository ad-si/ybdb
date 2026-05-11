const path = require("path")

const { Low, Memory } = require("lowdb")
const { DataFile } = require("lowdb/node")
const lodash = require("lodash")
const yaml = require("js-yaml")
const fsp = require("fs-extra")

const mainFiles = [
  // Sorted by descending importance
  "main.yaml",
  "index.yaml",
  "data.yaml",
]

class NoYamlError extends Error {
  constructor () {
    super("Directory does not contain a standard YAML file.")
  }
}

const yamlFormat = {
  parse: content => yaml.load(content),
  stringify: data => yaml.dump(data),
}

const yamlPattern = /(ya?ml|json)$/ // JSON is a subset of YAML


function readFileOrDir (nodePath) {
  return fsp
    .readFile(nodePath)
    .then(fileContent => {
      if (!yamlPattern.test(nodePath)) throw new NoYamlError()
      return fileContent
    })
    .catch(error => {
      if (!error.message.includes("EISDIR")) throw error

      return fsp
        .readdir(nodePath)
        .then(subNodeNames => {
          const matches = lodash.intersection(mainFiles, subNodeNames)

          if (!matches.length) throw new NoYamlError()

          const yamlPath = path.join(nodePath, matches[0])
          return fsp.readFile(yamlPath)
        })
    })
}


function readTree (storagePath, parse) {
  return fsp
    .readFile(storagePath)
    .then(content => {
      if (!yamlPattern.test(storagePath)) throw new NoYamlError()
      return parse(content)
    })
    .catch(error => {
      if (!error.message.includes("EISDIR")) throw error

      return fsp
        .readdir(storagePath)
        .then(nodeNames => nodeNames
          .map(nodeName => readFileOrDir(path.join(storagePath, nodeName))
            .then(fileContent => {
              const fileData = parse(fileContent)
              fileData.localId = path
                .basename(nodeName, path.extname(nodeName))
              return fileData
            })
            .catch(loadError => {
              if (loadError instanceof NoYamlError) return
              console.error(`Error in file ${nodeName}`)
              console.error(loadError.reason)
            }),
          ),
        )
        .then(filePromises => Promise.all(filePromises))
    })
    .then(fileObjects => ({
      [path.basename(storagePath, path.extname(storagePath))]: fileObjects
        .filter(Boolean),
    }))
}


function readTrees (storagePaths, parse) {
  const treePromises = storagePaths
    .map(storagePath => readTree(storagePath, parse))

  return Promise
    .all(treePromises)
    .then(dataObjects => Object.assign({}, ...dataObjects))
}


function joinKeys (object) {
  return [].concat.apply([], Object.values(object))
}


const defaultConfig = {
  format: yamlFormat,
  databaseName: "ybdb",
}


module.exports = class Ybdb {
  constructor (configObject) {
    this.config = configObject
  }

  async init () {
    if (!this.config) {
      return new Low(new Memory(), {})
    }

    const configObject = Object.assign(
      {},
      defaultConfig,
      this.config,
    )

    if (configObject.storagePath) {
      configObject.storagePaths = [configObject.storagePath]
    }

    if (configObject.storagePaths) {
      const data = await readTrees(
        configObject.storagePaths,
        configObject.format.parse,
      )
      const finalData = this.config.joined ? joinKeys(data) : data
      return new Low(new Memory(), finalData)
    }

    const filename = configObject.storageFile || configObject.databaseName
    const db = new Low(new DataFile(filename, configObject.format), {})
    await db.read()
    return db
  }
}
