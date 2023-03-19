import { getInputs, log, publishComment, setFailed, setSummary } from './utils';
import { TestReportProcessor } from './TestReportProcessor';
import { CommentBuilder } from './CommentBuilder';
import { SummaryGenerator } from './SummaryGenerator';

const run = async (): Promise<void> => {
  try {
    const {
      token,
      title,
      resultsPath,
      resultsGroup
    } = getInputs();

    // What if the results path has something nad the groups has things? Merge them
    // What if there is just the resultsPath? pass just that


    // Getting the test results
    const testReportProcessor = new TestReportProcessor();
    var testResult = await testReportProcessor.processReports(resultsPath);

    // Build the comment
    const commentBuilder = new CommentBuilder(testResult);
    const comment = commentBuilder
      .withHeader(title)
      .withSummaryLink()
      .withFooter()
      .build();

    // Generate the summary
    const summaryGenerator = new SummaryGenerator();
    const summary = summaryGenerator.generateSummary(title, testResult);

    // Set the summary
    await setSummary(summary);

    // Publishing results
    await publishComment(token, title, comment);
  } catch (error) {
    setFailed((error as Error).message);
  }
};

run()