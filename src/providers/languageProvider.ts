import type { Extension } from "../extension";
import { TextEditorBasedProvider } from "./textEditorBasedProvider";

export class LanguageProvider extends TextEditorBasedProvider {
  constructor(extension: Extension) {
    super(extension, "language", 0);
  }

  protected override registerVariables(): void {
    this.provide(
      "language_id",
      async () => this.textEditor?.document.languageId,
    );
  }
}
