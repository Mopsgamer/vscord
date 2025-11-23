import { TextEditor, window } from "vscode";
import { Provider } from "./provider";

export class TextEditorBasedProvider extends Provider {
    textEditor: TextEditor | undefined = window.activeTextEditor;

    public override subscribe(): void {
        if (this.activated)
            return;

        this.extension.context?.subscriptions.push(window.onDidChangeActiveTextEditor((e) => {
            this.textEditor = e
            this.extension.logger.info(this.textEditor)
        }));

        this.activated = true;
    }

    public override getLanguage(): string | undefined {
        return this.textEditor?.document.languageId
    }
}