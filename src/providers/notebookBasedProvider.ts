import { type NotebookEditor, window } from "vscode";
import { Provider } from "./provider";

export class NotebookBasedProvider extends Provider {
  protected get notebookEditor(): NotebookEditor | undefined {
    return window.activeNotebookEditor;
  }

  public override shouldSkip(): boolean {
    return !this.notebookEditor;
  }
}
