import { TextEditorBasedProvider } from "./textEditorBasedProvider";
import { Extension } from "../extension";

export class FileProvider extends TextEditorBasedProvider {
    constructor(extension: Extension) {
        super(extension, "file", 0, true)
    }
}