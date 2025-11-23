import { extensions, window } from "vscode";
import type { Extension } from "../extension";
import type { API, GitExtension, Repository } from "../types/git";
import { ExtensionBasedProvider } from "./extensionBasedProvider";

export class GitProvider extends ExtensionBasedProvider {
  public override readonly extensions: string[] = ["vscode.git"];

  private get gitApi(): API | undefined {
    return extensions
      .getExtension<GitExtension>("vscode.git")
      ?.exports.getAPI(1);
  }

  private get currentRepository(): Repository | null | undefined {
    const textEditor = window.activeTextEditor;
    if (!textEditor) return;

    return this.gitApi?.getRepository(textEditor.document.uri);
  }

  private get gitURL(): string | undefined {
    const remotes = this.currentRepository?.state.remotes ?? [];
    const remote = remotes.filter((r) => r.name === "origin")[0];
    return remote ? (remote.fetchUrl ?? remote.pushUrl) : undefined;
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

  public override shouldSkip(): boolean {
    return (
      super.shouldSkip() ||
      this.gitApi?.state !== "initialized" ||
      !this.currentRepository
    );
  }
}
