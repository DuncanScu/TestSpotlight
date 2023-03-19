import { IResult } from "./data";
import { formatElapsedTime, getSectionLink } from "./formatting/common";
import { getContext, IContext } from "./utils";

export class CommentBuilder {
    private _header: string = "";
    private _summaryLink: string = "";
    private _footer: string = "";
    private _context : IContext;
    private _title: string = "";
    private _testResult: IResult;
  
    constructor(testResult:IResult){
      this._testResult = testResult;
      this._context = getContext();
    }
  
    public withHeader(title:string = "Tests") : CommentBuilder {
      this._title = title;
      this._header = `## ${title}\n`;;
      return this;
    }
  
    public withSummaryLink() : CommentBuilder {
      const url = `https://github.com/${this._context.owner}/${this._context.repo}/actions/runs/${this._context.runId}#user-content-${getSectionLink(this._title)}`;
      this._summaryLink = `🔍 click [here](${url}) for more details\n`;
      return this;
    }
  
    public withFooter() : CommentBuilder {
      this._footer = this._context.commit ? `<br/>_✏️ updated for commit ${this._context.commit.substring(0, 8)}_` : '';
      return this;
    }
  
    public build(groupTitle:string) : string {
      const { total, passed, failed, skipped, success } = this._testResult;
      const icon = `${this.getStatusIcon(success)}`;
      const details = failed || skipped ? ` (${failed} failed, ${skipped} skipped)` : '';
      const info = `**${passed} / ${total}**${details}`;
      const status = `- Tests ${this.getStatusText(success)} in ${formatElapsedTime(this._testResult.elapsed)}`;

      const message = `${icon} ${info} ${status}\n`;

      const body = `<details>
      <summary>${groupTitle}</summary>\n
      <br/>\n
      ${message}\n
      </details>\n`;
      
      return `${this._header}${body}${passed < total ? this._summaryLink : ""}${this._footer}`;
    }

    private getStatusIcon = (success: boolean): string => (success ? '🧪' : '❌');
    
    private getStatusText = (success: boolean) => (success ? '**passed**' : '**failed**');
  }