import { Disposable, ConfigurationTarget, StatusBarAlignment, StatusBarItem, window, commands } from "vscode";
import { type ExtensionConfiguration, type ExtensionConfigurationType, getConfig } from "./config";
import { CONFIG_KEYS } from "./constants";
import { logInfo, outputChannel } from "./logger";

export enum StatusBarMode {
    Disabled,
    Disconnected,
    Pending,
    Succeeded
}

class EditorController implements Disposable {
    statusBarItem: StatusBarItem | undefined;

    #getAlignmentFromConfig(config: ExtensionConfiguration) {
        const value = config.get(CONFIG_KEYS.Behaviour.StatusBarAlignment);
        const isRight = value === "Right";
        return isRight ? StatusBarAlignment.Right : StatusBarAlignment.Left;
    }

    setStatusBarItem(mode: StatusBarMode) {
        const config = getConfig();
        if (!config.get(CONFIG_KEYS.Enable)) {
            mode = StatusBarMode.Disabled;
        }
        if (!this.statusBarItem) {
            logInfo("setStatusBarItem: status bar item is undefined");
            this.statusBarItem = window.createStatusBarItem(this.#getAlignmentFromConfig(getConfig()));
        }
        if (mode === StatusBarMode.Disabled) {
            this.statusBarItem.hide();
            return;
        }

        const whenDisconnected: Partial<StatusBarItem> = {
            text: "$(warning) Discord RPC",
            tooltip: "Disconnected. Click to reconnect",
            command: "vscord.reconnect"
        };
        const whenPending: Partial<StatusBarItem> = {
            text: "$(pulse) Discord RPC",
            tooltip: "Please, wait. Connecting to Discord Gateway..."
        };
        const whenSucceeded: Partial<StatusBarItem> = {
            text: "Discord RPC",
            tooltip: "Connected to Discord Gateway. Click to disconnect",
            command: "vscord.disconnect"
        };
        const statusBarItemByMode = {
            [StatusBarMode.Disconnected]: whenDisconnected,
            [StatusBarMode.Pending]: whenPending,
            [StatusBarMode.Succeeded]: whenSucceeded
        };

        Object.assign(this.statusBarItem, statusBarItemByMode[mode]);
        this.statusBarItem.show();
    }

    toggleStatusBarAlignment(onLeft?: boolean) {
        const config = getConfig();
        const cfgKey = CONFIG_KEYS.Behaviour.StatusBarAlignment;
        const alignment = (onLeft ?? config.get(cfgKey) === "Right") ? "Left" : "Right";

        config.update(cfgKey, alignment satisfies ExtensionConfigurationType[typeof cfgKey]);
        return alignment;
    }

    updateStatusBarFromConfig() {
        const config = getConfig();
        if (!config.get(CONFIG_KEYS.Enable)) {
            this.setStatusBarItem(StatusBarMode.Disabled);
        }
        const alignment = this.#getAlignmentFromConfig(config);
        const priority = undefined;
        if (!this.statusBarItem) {
            logInfo("updateStatusBarFromConfig: status bar item is undefined");
            this.statusBarItem = window.createStatusBarItem(this.#getAlignmentFromConfig(getConfig()));
        }

        const old = this.statusBarItem;
        if (this.statusBarItem.alignment === alignment) {
            return;
        }

        // Change unchangable: alignment/priority
        this.statusBarItem = window.createStatusBarItem(alignment, priority);
        //#region copy
        this.statusBarItem.text = old.text;
        this.statusBarItem.tooltip = old.tooltip;
        this.statusBarItem.color = old.color;
        this.statusBarItem.command = old.command;
        this.statusBarItem.accessibilityInformation = old.accessibilityInformation;
        //#endregion

        this.statusBarItem.show();
        old.dispose();
    }

    #errorMessageFailedToConnectSelect(config: ExtensionConfiguration, key: string, selection?: string) {
        if (selection === "Reconnect") {
            commands.executeCommand("vscord.reconnect");
        } else if (selection === "Show output") {
            outputChannel.show(true);
        } else if (selection === "Don't show again") {
            config.update(key, true, ConfigurationTarget.Global);
        }
    }
    errorMessageFailedToConnect(config: ExtensionConfiguration, error?: Error) {
        if (config.get(CONFIG_KEYS.Behaviour.SuppressNotifications)) {
            return;
        }

        const buttons = ["Reconnect", "Show output"];
        if (!(error instanceof Error)) {
            const message = "Failed to connect to Discord Gateway.";
            window
                .showErrorMessage(message, ...buttons)
                .then((selection) => this.#errorMessageFailedToConnectSelect(config, "", selection));
            return;
        }

        const configKeyPairs = {
            RPC_COULD_NOT_CONNECT: CONFIG_KEYS.Behaviour.SuppressRpcCouldNotConnect
        } as const;

        const errorName = error.name;
        const suppressConfigKey: string | undefined = configKeyPairs[errorName as keyof typeof configKeyPairs];
        if (suppressConfigKey) {
            const suppressed = config.get(suppressConfigKey);
            if (suppressed) {
                return;
            }

            buttons.push("Don't show again");
        }

        const message = `Failed to connect to Discord Gateway: ${error.name}.`;
        window
            .showErrorMessage(message, ...buttons)
            .then((selection) => this.#errorMessageFailedToConnectSelect(config, suppressConfigKey, selection));
        return;
    }

    public dispose(): void {
        this.statusBarItem?.dispose();
        this.statusBarItem = undefined;
    }
}

export const editor = new EditorController();
