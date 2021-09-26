
import Joi from 'joi'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { exit } from 'process'
import { cloneDeep } from 'lodash'


export const schema = Joi.object({
  docsDirMap: Joi.object().pattern(/\W/, 
    Joi.array().items(
      Joi.string().required(), Joi.string().required()
    ))
})

export const defaultOptions = {
  docsDirMap: {}
}

let cachedOptions: any

const rcPath = path.resolve(os.homedir(), '.chwechrc')

export const loadOptions = () => {
  if (cachedOptions) {
    return cachedOptions
  }
  if (fs.existsSync(rcPath)) {
    try {
      cachedOptions = JSON.parse(fs.readFileSync(rcPath, 'utf-8'))
    } catch (e) {
      // error(
      //   `Error loading saved preferences: ` +
      //   `~/.vuerc may be corrupted or have syntax errors. ` +
      //   `Please fix/delete it and re-run vue-cli in manual mode.\n` +
      //   `(${e.message})`
      // )
      exit(1)
    }
    // validate(cachedOptions, schema, () => {
    //   error(
    //     `~/.vuerc may be outdated. ` +
    //     `Please delete it and re-run vue-cli in manual mode.`
    //   )
    // })
    return cachedOptions
  } else {
    return {}
  }
}

export const saveOptions = (toSave: object) => {
  const options = Object.assign(cloneDeep(loadOptions()), toSave)
  for (const key in options) {
    if (!(key in defaultOptions)) {
      delete options[key]
    }
  }
  cachedOptions = options
  try {
    fs.writeFileSync(rcPath, JSON.stringify(options, null, 2))
    return true
  } catch (e) {
    // error(
    //   `Error saving preferences: ` +
    //   `make sure you have write access to ${rcPath}.\n` +
    //   `(${e.message})`
    // )
  }
}