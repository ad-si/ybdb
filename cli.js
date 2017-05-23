#! /usr/bin/env node

const path = require('path')
const chalk = require('chalk')
const prettyjson = require('prettyjson')


const Config = require('@datatypes/config')
const config = new Config({
  appName: 'ybdb',
})

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

config
  .loadEnvironment()
  .loadCliArguments()
  .loadDefaultFiles()

const args = process.argv.slice(2)
executeCommand(args)
