import { TextEditorBasedProvider } from "./textEditorBasedProvider";
import { Extension } from "../extension";

export class LanguageProvider extends TextEditorBasedProvider {
    constructor(extension: Extension) {
        super(extension, "language", 0, true);
    }

    public override getLanguage(): string | undefined {
        return this.textEditor?.document.languageId
    }
}