import { Extension } from "../extension";
import { Provider } from "./provider";

export class GitProvider extends Provider {
    constructor(extension: Extension) {
        super(extension, "git", 0)
    }
}