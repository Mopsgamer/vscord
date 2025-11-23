import { Extension } from "../extension";
import { Provider } from "./provider";

export class JupyterProvider extends Provider {
    constructor(extension: Extension) {
        super(extension, "jupyter", 1)
    }
}