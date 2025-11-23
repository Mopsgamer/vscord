import type * as vscode from "vscode";
import { Extension } from "./extension";

export const extension = new Extension();

export function activate(ctx: vscode.ExtensionContext): void {
  extension.activate(ctx);
}

export function deactivate(): void {
  extension.deactivate();
}
