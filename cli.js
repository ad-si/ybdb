#! /usr/bin/env node

const path = require('path')
const chalk = require('chalk')
const prettyjson = require('prettyjson')
const clone = require('clone')
const Config = require('@datatypes/config')

function reduceObject (data) {
  const timedObject = {}
  Object
    .keys(data)
    .forEach(key => {
      const keyString = String(key)
      const isDatetime = keyString.length > 2 &&
        String(new Date(keyString)) !== 'Invalid Date'

      if (isDatetime) {
        timedObject[key] = clone(data[key])
        delete data[key]
      }
    })

  const reducedObject = clone(data)

  if (Object.keys(timedObject).length) {
    // See https://github.com/adius/eventlang-reduce for explanation
    for (const timestamp in timedObject) {
      if (!timedObject.hasOwnProperty(timestamp)) continue
      Object.assign(reducedObject, timedObject[timestamp])
    }
  }

  return reducedObject
}

async function executeCommand (args = []) {
  const renderOptions = {
    keysColor: 'gray',
  }
  if (args.length === 0) {
    console.info('ybdb [path]')
    return
  }

  if (Object.keys(config.config).length > 0) {
    console.info('ybdb was executed with following options:')
    console.info(prettyjson.render(config.config, renderOptions))
  }

  const storagePath = path.resolve(args[0] || '.')
  const Ybdb = require('.')
  const database = new Ybdb({ storagePath })
  try {
    const initializedDb = await database.init()
    const data = initializedDb.getState()
    const valuesOfFirstKey = data[Object.keys(data)[0]]

    valuesOfFirstKey
      .forEach(value => {
        value = reduceObject(value)

        if (value.title) {
          console.info(chalk.cyan.underline(value.title))
        }

        delete value.title
        console.info(prettyjson.render(value, renderOptions) + '\n')
      })
  }
  catch (error) {
    console.error(error)
  }
}

const config = new Config({
  appName: 'ybdb',
})
config
  .loadDefaultFiles()
  .loadEnvironment()
  .loadCliArguments()

const args = process.argv.slice(2)
executeCommand(args)
