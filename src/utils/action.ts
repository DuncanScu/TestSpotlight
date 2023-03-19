import * as core from '@actions/core'
import {IActionInputs, IResult} from '../data'

const inputs = {
  token: 'github-token',
  title: 'comment-title',
  groups: 'groups'
}

const outputs = {
  total: 'tests-total',
  passed: 'tests-passed',
  failed: 'tests-failed',
  skipped: 'tests-skipped',
  lineCoverage: 'coverage-line',
  linesTotal: 'coverage-lines-total',
  linesCovered: 'coverage-lines-covered',
  branchCoverage: 'coverage-branch',
  branchesTotal: 'coverage-branches-total',
  branchesCovered: 'coverage-branches-covered'
}

export const getInputs = (): IActionInputs => {
  const token = core.getInput(inputs.token) || process.env['GITHUB_TOKEN'] || ''

  return {
    token,
    title: core.getInput(inputs.title),
    groups: core.getInput(inputs.groups)
  }
}

export const setResultOutputs = (result: IResult): void => {
  core.setOutput(outputs.total, result.total)
  core.setOutput(outputs.passed, result.passed)
  core.setOutput(outputs.failed, result.failed)
  core.setOutput(outputs.skipped, result.skipped)
}

export const setFailed = (message: string): void => {
  core.setFailed(message)
}

export const setSummary = async (text: string): Promise<void> => {
  await core.summary.addRaw(text).write()
}

export const log = (message: string): void => {
  core.info(message)
}
