import {getInputs, log, publishComment, setFailed, setSummary} from './utils'
import {TestReportProcessor} from './TestReportProcessor'
import {CommentBuilder} from './CommentBuilder'
import {SummaryGenerator} from './SummaryGenerator'

const run = async (): Promise<void> => {
  try {
    const {token, title, groups} = getInputs()

    const groupsData = groups.split(',')

    log(groupsData[0])
    const resultsPath = groupsData[0].split(':')[0]
    const fileType = groupsData[0].split(':')[1]

    const testReportProcessor = TestReportProcessor.getInstance()
    var testResult = await testReportProcessor.processReports(
      resultsPath,
      fileType
    )

    const commentBuilder = new CommentBuilder(testResult)
    const comment = commentBuilder
      .withHeader(title)
      .withSummaryLink()
      .withFooter()
      .build()

    const summaryGenerator = new SummaryGenerator()
    const summary = summaryGenerator.generateSummary(title, testResult)

    await setSummary(summary)

    await publishComment(token, title, comment)
  } catch (error) {
    setFailed((error as Error).message)
  }
}

run()
