import fs from 'fs'
import path from 'path'
import xml2js from 'xml2js'

export const readXmlFile = async (filePath: string): Promise<any> => {
  try {
    if (!fs.existsSync(filePath)) {
      return null
    }

    const file = fs.readFileSync(filePath)
    const parser = new xml2js.Parser()
    return await parser.parseStringPromise(file)
  } catch {
    return null
  }
}

export const readJsonFile = async (filePath: string): Promise<any> => {
  try {
    if (!fs.existsSync(filePath)) {
      return null
    }

    const file = fs.readFileSync(filePath, 'utf-8')
    const jsonData: object = JSON.parse(file)
    return jsonData
  } catch (error) {
    return null
  }
}
