import { window } from "vscode";
import { Base } from "./base";

export class Logger extends Base {
  outputChannel = window.createOutputChannel("VSCord");

  public info(...messages: unknown[]): void {
    this.log("[INFO]", ...messages);
  }

  public error(...messages: unknown[]): void {
    this.log("[ERROR]", ...messages);
  }

  public warn(...messages: unknown[]): void {
    this.log("[WARN]", ...messages);
  }

  public debug(...messages: unknown[]): void {
    this.log("[DEBUG]", ...messages);
  }

  public log(...messages: unknown[]): void {
    this.outputChannel.appendLine(messages.join(" "));
    // for debug console
    console.log(...messages);
  }

  public clear(): void {
    this.outputChannel.clear();
    console.clear();
  }
}
