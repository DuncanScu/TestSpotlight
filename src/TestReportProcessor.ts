import fs from 'fs'
import path from 'path'
import {IResult} from './data'
import {Group} from './data/Group'
import {DotnetTrxParser} from './parsers/DotnetTrxParser'
import {MochaJsonParser} from './parsers/MochaJsonParser'
import {log, setFailed, setResultOutputs} from './utils'

export class TestReportProcessor {
  private static _instance: TestReportProcessor
  private _dotnetTrxParser: DotnetTrxParser
  private _mochaJsonParser: MochaJsonParser

  private constructor() {
    this._dotnetTrxParser = new DotnetTrxParser()
    this._mochaJsonParser = new MochaJsonParser()
  }

  public static getInstance(): TestReportProcessor {
    if (!this._instance) {
      this._instance = new TestReportProcessor()
    }
    return this._instance
  }

  public async processReports(groups: Group[]): Promise<IResult> {
    const result = this.DefaultTestResult
    const filePaths: {path: string; extension: string}[] = []
    groups.forEach(async group => {
      const paths = this.findReportsInDirectory(group.filePath, group.extension)

      if (!filePaths.length) {
        throw Error(
          `No test results found in ${group.filePath}, with ${group.extension}`
        )
      }

      paths.forEach(path =>
        filePaths.push({path: path, extension: group.extension})
      )
    })

    for (const resultPath of filePaths) {
      log(`Current result total = ${result.total}`)
      await this.processResult(resultPath.path, result, resultPath.extension)

      if (!result.success) {
        setFailed('Tests Failed')
      }
    }

    return result
  }

  private async processResult(
    path: string,
    aggregatedResult: IResult,
    extension: string
  ): Promise<void> {
    let result: IResult | null = null

    switch (extension) {
      case '.trx':
        result = await this._dotnetTrxParser.parse(path)
        break
      case '.json':
        result = await this._mochaJsonParser.parse(path)
        break
      default:
        throw Error('File type not supported.')
    }

    if (!result) {
      throw Error(`Failed parsing ${path}`)
    }

    log(`Processed ${path}`)
    return this.mergeTestResults(aggregatedResult, result)
  }

  private findReportsInDirectory(
    directoryPath: string,
    extension: string
  ): string[] {
    try {
      if (!fs.existsSync(directoryPath)) {
        return []
      }

      const fileNames = fs.readdirSync(directoryPath)
      const filteredFileNames = fileNames.filter(fileName =>
        fileName.endsWith(extension)
      )
      return filteredFileNames.map(fileName =>
        path.join(directoryPath, fileName)
      )
    } catch {
      return []
    }
  }

  private mergeTestResults(result1: IResult, result2: IResult): void {
    result1.success = result1.success && result2.success
    result1.elapsed += result2.elapsed
    result1.total += result2.total
    result1.passed += result2.passed
    result1.failed += result2.failed
    result1.skipped += result2.skipped
    result1.suits.push(...result2.suits)
  }

  private DefaultTestResult: IResult = {
    success: true,
    elapsed: 0,
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    suits: []
  }
}
