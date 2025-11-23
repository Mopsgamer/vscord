import { ExtensionBasedProvider } from "./extensionBasedProvider";
import { Extension } from "../extension";
import { extensions, window, workspace } from "vscode";
import { Git, GitExtension } from "../types/git";
import { TextEditorBasedProvider } from "./textEditorBasedProvider";

export class GitProvider extends ExtensionBasedProvider {
  public override readonly extensions: string[] = ["vscode.git"];

  private get gitApi() {
    return extensions
      .getExtension<GitExtension>("vscode.git")
      ?.exports.getAPI(1);
  }

  private get currentRepository() {
    const textEditor = window.activeTextEditor;
    if (!textEditor) return;

    return this.gitApi?.getRepository(textEditor.document.uri);
  }

  private get currentBranch() {
    return this.currentRepository?.state.HEAD;
  }

  private get gitURL() {
    const remotes = this.currentRepository?.state.remotes ?? [];
    const remote = remotes.filter((r) => r.name === "origin")[0];
    return remote ? remote.fetchUrl ?? remote.pushUrl : undefined;
  }

  constructor(extension: Extension) {
    super(extension, "git", 0);
  }

  protected override registerVariables(): void {
    this.provide("git_ok", async () => {
      this.extension.logger.debug(this.gitURL);
      return "ok";
    });
  }
}
