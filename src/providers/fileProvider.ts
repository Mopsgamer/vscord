import type { Extension } from "../extension";
import { TextEditorBasedProvider } from "./textEditorBasedProvider";

export class FileProvider extends TextEditorBasedProvider {
  constructor(extension: Extension) {
    super(extension, "file", 0);
  }

  protected override registerVariables(): void {
    this.provide("file_path", async () => this.textEditor?.document.fileName);
  }
}
