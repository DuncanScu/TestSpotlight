import {ITest, ITestSuit, ResultParser} from '../data'
import {log, readJsonFile} from '../utils'
import {Parser} from './Parser'

export class MochaJsonParser implements Parser {
  public parse: ResultParser = async (filePath: string) => {
    const file = await readJsonFile(filePath)

    if (!file) {
      return null
    }
    const stats = file.stats

    const summary = this.parseSummary(file)
    const suits = this.parseSuits(file)

    const skipped = stats.skipped
    const success = stats.failures === 0

    const elapsed = stats.duration
    return {success, ...summary, skipped, elapsed, suits}
  }

  private parseSummary = (file: any) => {
    const summary = file.stats

    const outcome = summary.passPercent === 100 ? 'Passed' : 'Failed'

    return {
      outcome: outcome,
      total: summary.tests,
      passed: summary.passes,
      failed: summary.failures,
      executed: summary.tests - summary.skipped
    }
  }

  private parseSuits = (file: any) => {
    const suites: any[] = file.suites
    log('Suites')
    const results: ITestSuit[] = []
    suites.forEach(suite => {
      const name = suite.title
      const success = suite.failures.length === 0
      const passed = suite.passes.length
      const tests = this.parseTests(suite.tests)
      results.push({name, success, passed, tests})
    })
    return results
  }

  private parseTests = (tests: any[]): ITest[] => {
    const results: ITest[] = []
    log('Tests')
    tests.forEach(test => {
      const name = test.title
      const output = test.code
      const error = test.err?.message ?? ''
      const trace = test.err?.estack ?? ''
      const outcome = test.state[0].toUpperCase() + test.state.slice(1)
      results.push({name, output, error, trace, outcome})
    })

    return results
  }
}
