export default interface IActionInputs {
  token: string;
  title: string;
  resultsPath: string;
  resultGroups: ResultGroup[];
}

export interface ResultGroup {
  resultsPath: string;
  groupTitle: string;
}