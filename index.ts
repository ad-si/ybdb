import path from "path"

import { Low, Memory } from "lowdb"
import { DataFile } from "lowdb/node"
import lodash from "lodash"
import yaml from "js-yaml"
import fsp from "fs-extra"

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

export interface YbdbFormat<T = unknown> {
  parse: (content: string) => T
  stringify: (data: T) => string
}

const yamlFormat: YbdbFormat = {
  parse: content => yaml.load(content),
  stringify: data => yaml.dump(data),
}

const yamlPattern = /(ya?ml|json)$/ // JSON is a subset of YAML


function readFileOrDir (nodePath: string): Promise<Buffer | string> {
  return fsp
    .readFile(nodePath)
    .then(fileContent => {
      if (!yamlPattern.test(nodePath)) throw new NoYamlError()
      return fileContent
    })
    .catch((error: NodeJS.ErrnoException) => {
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


type ParseFn = (content: string) => unknown


function readTree (
  storagePath: string,
  parse: ParseFn,
): Promise<Record<string, unknown[]>> {
  return fsp
    .readFile(storagePath)
    .then((content: Buffer | string) => {
      if (!yamlPattern.test(storagePath)) throw new NoYamlError()
      return parse(content.toString())
    })
    .catch((error: NodeJS.ErrnoException) => {
      if (!error.message.includes("EISDIR")) throw error

      return fsp
        .readdir(storagePath)
        .then(nodeNames => nodeNames
          .map(nodeName => readFileOrDir(path.join(storagePath, nodeName))
            .then(fileContent => {
              const fileData = parse(fileContent.toString()) as
                Record<string, unknown>
              fileData.localId = path
                .basename(nodeName, path.extname(nodeName))
              return fileData
            })
            .catch((loadError: Error) => {
              if (loadError instanceof NoYamlError) return
              console.error(`Error in file ${nodeName}`)
              console.error((loadError as { reason?: string }).reason)
            }),
          ),
        )
        .then(filePromises => Promise.all(filePromises))
    })
    .then(fileObjects => {
      const arr = Array.isArray(fileObjects) ? fileObjects : [fileObjects]
      return {
        [path.basename(storagePath, path.extname(storagePath))]: arr
          .filter(Boolean) as unknown[],
      }
    })
}


function readTrees (
  storagePaths: string[],
  parse: ParseFn,
): Promise<Record<string, unknown[]>> {
  const treePromises = storagePaths
    .map(storagePath => readTree(storagePath, parse))

  return Promise
    .all(treePromises)
    .then(dataObjects => Object.assign({}, ...dataObjects))
}


function joinKeys (object: Record<string, unknown[]>): unknown[] {
  return ([] as unknown[]).concat(...Object.values(object))
}


const defaultConfig = {
  format: yamlFormat,
  databaseName: "ybdb",
}


export interface YbdbConfig {
  format?: YbdbFormat
  databaseName?: string
  storagePath?: string
  storagePaths?: string[]
  storageFile?: string
  joined?: boolean
}


export default class Ybdb {
  config?: YbdbConfig

  constructor (configObject?: YbdbConfig) {
    this.config = configObject
  }

  async init (): Promise<Low<unknown>> {
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

module.exports = Ybdb
module.exports.default = Ybdb
