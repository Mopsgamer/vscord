import { Base } from "../structures/base";
import { Extension } from "../extension";
import { workspace } from "vscode";

/**
 * Provider is the main way for VSCord to figure out what variable name corospond to what
 */

export class Provider extends Base {
  public activated = false;
  private variables = new Map<string, () => string | undefined>();

  constructor(
    extension: Extension,
    public id = "base",
    public priority = 0,
    public supportLang = false
  ) {
    super(extension);
  }

  public subscribe() {
    return;
  }

  public getLanguage(): string | undefined {
    return;
  }

  public shouldSkip(): boolean {
    return true;
  }

  public hasVariable(name: string): boolean {
    return this.variables.has(name);
  }

  private provide(name: string, value: () => string | undefined) {
    this.variables.set(name, value);
  }
}
