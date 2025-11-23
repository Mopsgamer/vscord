import { Disposable, type ExtensionContext } from "vscode";
import { ProviderManager } from "./managers/providerManager";
import { FileProvider } from "./providers/fileProvider";
import { GitProvider } from "./providers/gitProvider";
import { JupyterProvider } from "./providers/jupyterProvider";
import { LanguageProvider } from "./providers/languageProvider";
import { Logger } from "./structures/logger";

export class Extension extends Disposable {
  providerManager = new ProviderManager(this);
  context: ExtensionContext | undefined;
  logger = new Logger(this);

  activated = false;

  constructor() {
    super(() => {
      this.dispose();
    });

    this.providerManager.createProvider(LanguageProvider);
    this.providerManager.createProvider(FileProvider);
    this.providerManager.createProvider(JupyterProvider);
    this.providerManager.createProvider(GitProvider);
  }

  public activate(ctx: ExtensionContext): void {
    this.context = ctx;
    this.providerManager.subscribe();
    this.logger.info("VSCord is activated!");
    this.activated = true;

    // Temporary debug code
    setInterval(async () => {
      this.logger.debug(
        "file name ->",
        await this.providerManager.resolveVariable("file_name"),
      );
      this.logger.debug(
        "language id ->",
        await this.providerManager.resolveVariable("language_id"),
      );
      this.logger.debug(
        "is git ok?",
        await this.providerManager.resolveVariable("git_ok"),
      );
      this.logger.debug(
        "unknown value",
        await this.providerManager.resolveVariable("gserersthiuwaerhuiarwehu"),
      );
    }, 1000);
  }

  public deactivate(): void {
    this.dispose();
    this.activated = false;
  }

  public dispose(): void {
    for (const subscription of this.context?.subscriptions ?? []) {
      subscription.dispose();
    }
  }
}
