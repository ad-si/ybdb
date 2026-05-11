#! /usr/bin/env node

import chalk from "chalk"
import clone from "clone"
import path from "path"
import prettyjson from "prettyjson"

import Config from "@datatypes/config"

import Ybdb from "./index.js"

interface ConfigLike {
  config: Record<string, unknown>
  loadDefaultFiles: () => ConfigLike
  loadEnvironment: () => ConfigLike
  loadCliArguments: () => ConfigLike
}

function reduceObject (data: Record<string, unknown>): Record<string, unknown> {
  const timedObject: Record<string, unknown> = {}
  Object
    .keys(data)
    .forEach(key => {
      const keyString = String(key)
      const isDatetime = keyString.length > 2 &&
        String(new Date(keyString)) !== "Invalid Date"

      if (isDatetime) {
        timedObject[key] = clone(data[key])
        delete data[key]
      }
    })

  const reducedObject = clone(data)

  if (Object.keys(timedObject).length) {
    // See https://github.com/adius/eventlang-reduce for explanation
    for (const timestamp in timedObject) {
      if (!Object.prototype.hasOwnProperty.call(timedObject, timestamp)) {
        continue
      }
      Object.assign(
        reducedObject,
        timedObject[timestamp] as Record<string, unknown>,
      )
    }
  }

  return reducedObject
}

async function executeCommand (args: string[] = []): Promise<void> {
  const renderOptions = {
    keysColor: "gray",
  }
  if (args.length === 0) {
    console.info("ybdb [path]")
    return
  }

  if (Object.keys(config.config).length > 0) {
    console.info("ybdb was executed with following options:")
    console.info(prettyjson.render(config.config, renderOptions))
  }

  const storagePath = path.resolve(args[0] || ".")
  const database = new Ybdb({ storagePath })
  try {
    const initializedDb = await database.init()
    const data = initializedDb.data as Record<string, unknown[]>
    const valuesOfFirstKey = data[Object.keys(data)[0]]

    valuesOfFirstKey
      .forEach((value: unknown) => {
        const reduced = reduceObject(value as Record<string, unknown>)

        if (reduced.title) {
          console.info(chalk.cyan.underline(String(reduced.title)))
        }

        delete reduced.title
        console.info(prettyjson.render(reduced, renderOptions) + "\n")
      })
  }
  catch (error) {
    console.error(error)
  }
}

const config: ConfigLike = new Config({
  appName: "ybdb",
})
config
  .loadDefaultFiles()
  .loadEnvironment()
  .loadCliArguments()

const args = process.argv.slice(2)
executeCommand(args)
