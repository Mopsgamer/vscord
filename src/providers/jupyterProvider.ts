import type { Extension } from "../extension";
import { NotebookBasedProvider } from "./notebookBasedProvider";

export class JupyterProvider extends NotebookBasedProvider {
  constructor(extension: Extension) {
    super(extension, "jupyter", 1);
  }
}
