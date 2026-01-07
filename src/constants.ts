import lang from "./data/languages.json";

export const { KNOWN_EXTENSIONS, KNOWN_LANGUAGES } = lang as {
    KNOWN_EXTENSIONS: Record<string, { image: string }>;
    KNOWN_LANGUAGES: Array<{ language: string; image: string }>;
};

export const EMPTY = "";
export const FAKE_EMPTY = "\u200b\u200b";

export const CONFIG_KEYS = {
    Enable: "vscord.enable" as const,
    App: {
        Id: "vscord.app.id" as const,
        Name: "vscord.app.name" as const,
        PrivacyMode: "vscord.app.privacyMode.enable" as const,
        WhitelistEnabled: "vscord.app.whitelistEnabled" as const,
        whitelistIsBlacklist: "vscord.app.whitelistIsBlacklist" as const,
        Whitelist: "vscord.app.whitelist" as const
    } as const,
    Status: {
        Details: {
            Enabled: "vscord.status.details.enabled" as const,
            Idle: {
                Enabled: "vscord.status.details.idle.enabled" as const
            } as const,
            Text: {
                Idle: "vscord.status.details.text.idle" as const,
                Editing: "vscord.status.details.text.editing" as const,
                Viewing: "vscord.status.details.text.viewing" as const,
                NotInFile: "vscord.status.details.text.notInFile" as const,
                NoWorkspaceText: "vscord.status.details.text.noWorkSpaceText" as const,
                Debugging: "vscord.status.details.text.debugging" as const
            } as const
        } as const,
        State: {
            Enabled: "vscord.status.state.enabled" as const,
            Debugging: {
                Enabled: "vscord.status.state.debugging.enabled" as const
            } as const,
            Idle: {
                Enabled: "vscord.status.state.idle.enabled" as const
            } as const,
            Text: {
                Idle: "vscord.status.state.text.idle" as const,
                Editing: "vscord.status.state.text.editing" as const,
                Debugging: "vscord.status.state.text.debugging" as const,
                Viewing: "vscord.status.state.text.viewing" as const,
                NotInFile: "vscord.status.state.text.notInFile" as const,
                NoWorkspaceFound: "vscord.status.state.text.noWorkspaceFound" as const
            } as const
        } as const,
        Buttons: {
            Button1: {
                Enabled: "vscord.status.buttons.button1.enabled" as const,
                Active: {
                    Enabled: "vscord.status.buttons.button1.active.enabled" as const,
                    Label: "vscord.status.buttons.button1.active.label" as const,
                    Url: "vscord.status.buttons.button1.active.url" as const
                } as const,
                Inactive: {
                    Enabled: "vscord.status.buttons.button1.inactive.enabled" as const,
                    Label: "vscord.status.buttons.button1.inactive.label" as const,
                    Url: "vscord.status.buttons.button1.inactive.url" as const
                } as const,
                Idle: {
                    Enabled: "vscord.status.buttons.button1.idle.enabled" as const,
                    Label: "vscord.status.buttons.button1.idle.label" as const,
                    Url: "vscord.status.buttons.button1.idle.url" as const
                } as const,
                Git: {
                    Active: {
                        Enabled: "vscord.status.buttons.button1.git.active.enabled" as const,
                        Label: "vscord.status.buttons.button1.git.active.label" as const,
                        Url: "vscord.status.buttons.button1.git.active.url" as const
                    } as const,
                    Inactive: {
                        Enabled: "vscord.status.buttons.button1.git.inactive.enabled" as const,
                        Label: "vscord.status.buttons.button1.git.inactive.label" as const,
                        Url: "vscord.status.buttons.button1.git.inactive.url" as const
                    } as const,
                    Idle: {
                        Enabled: "vscord.status.buttons.button1.git.idle.enabled" as const,
                        Label: "vscord.status.buttons.button1.git.idle.label" as const,
                        Url: "vscord.status.buttons.button1.git.idle.url" as const
                    } as const
                } as const
            },
            Button2: {
                Enabled: "vscord.status.buttons.button2.enabled" as const,
                Active: {
                    Enabled: "vscord.status.buttons.button2.active.enabled" as const,
                    Label: "vscord.status.buttons.button2.active.label" as const,
                    Url: "vscord.status.buttons.button2.active.url" as const
                } as const,
                Inactive: {
                    Enabled: "vscord.status.buttons.button2.inactive.enabled" as const,
                    Label: "vscord.status.buttons.button2.inactive.label" as const,
                    Url: "vscord.status.buttons.button2.inactive.url" as const
                } as const,
                Idle: {
                    Enabled: "vscord.status.buttons.button2.idle.enabled" as const,
                    Label: "vscord.status.buttons.button2.idle.label" as const,
                    Url: "vscord.status.buttons.button2.idle.url" as const
                } as const,
                Git: {
                    Active: {
                        Enabled: "vscord.status.buttons.button2.git.active.enabled" as const,
                        Label: "vscord.status.buttons.button2.git.active.label" as const,
                        Url: "vscord.status.buttons.button2.git.active.url" as const
                    } as const,
                    Inactive: {
                        Enabled: "vscord.status.buttons.button2.git.inactive.enabled" as const,
                        Label: "vscord.status.buttons.button2.git.inactive.label" as const,
                        Url: "vscord.status.buttons.button2.git.inactive.url" as const
                    } as const,
                    Idle: {
                        Enabled: "vscord.status.buttons.button2.git.idle.enabled" as const,
                        Label: "vscord.status.buttons.button2.git.idle.label" as const,
                        Url: "vscord.status.buttons.button2.git.idle.url" as const
                    } as const
                } as const
            }
        } as const,
        Image: {
            Large: {
                Idle: {
                    Key: "vscord.status.image.large.idle.key" as const,
                    Text: "vscord.status.image.large.idle.text" as const
                } as const,
                Editing: {
                    Key: "vscord.status.image.large.editing.key" as const,
                    Text: "vscord.status.image.large.editing.text" as const
                } as const,
                Debugging: {
                    Key: "vscord.status.image.large.debugging.key" as const,
                    Text: "vscord.status.image.large.debugging.text" as const
                } as const,
                Viewing: {
                    Key: "vscord.status.image.large.viewing.key" as const,
                    Text: "vscord.status.image.large.viewing.text" as const
                } as const,
                NotInFile: {
                    Key: "vscord.status.image.large.notInFile.key" as const,
                    Text: "vscord.status.image.large.notInFile.text" as const
                } as const
            } as const,
            Small: {
                Idle: {
                    Key: "vscord.status.image.small.idle.key" as const,
                    Text: "vscord.status.image.small.idle.text" as const
                } as const,
                Editing: {
                    Key: "vscord.status.image.small.editing.key" as const,
                    Text: "vscord.status.image.small.editing.text" as const
                } as const,
                Debugging: {
                    Key: "vscord.status.image.small.debugging.key" as const,
                    Text: "vscord.status.image.small.debugging.text" as const
                } as const,
                Viewing: {
                    Key: "vscord.status.image.small.viewing.key" as const,
                    Text: "vscord.status.image.small.viewing.text" as const
                } as const,
                NotInFile: {
                    Key: "vscord.status.image.small.notInFile.key" as const,
                    Text: "vscord.status.image.small.notInFile.text" as const
                } as const
            } as const
        } as const,
        Problems: {
            Enabled: "vscord.status.problems.enabled" as const,
            Text: "vscord.status.problems.text" as const,
            countedSeverities: "vscord.status.problems.countedSeverities" as const
        } as const,
        Idle: {
            Enabled: "vscord.status.idle.enabled" as const,
            Check: "vscord.status.idle.check" as const,
            DisconnectOnIdle: "vscord.status.idle.disconnectOnIdle" as const,
            ResetElapsedTime: "vscord.status.idle.resetElapsedTime" as const,
            Timeout: "vscord.status.idle.timeout" as const
        } as const,
        ShowElapsedTime: "vscord.status.showElapsedTime" as const,
        ResetElapsedTimePerFile: "vscord.status.resetElapsedTimePerFile" as const
    } as const,
    Ignore: {
        Workspaces: "vscord.ignore.workspaces" as const,
        WorkspacesText: "vscord.ignore.workspacesText" as const,
        Repositories: "vscord.ignore.repositories" as const,
        Organizations: "vscord.ignore.organizations" as const,
        GitHosts: "vscord.ignore.gitHosts" as const
    } as const,
    File: {
        Size: {
            HumanReadable: "vscord.file.size.humanReadable" as const,
            Standard: "vscord.file.size.standard" as const,
            Round: "vscord.file.size.round" as const,
            Spacer: "vscord.file.size.spacer" as const
        } as const
    } as const,
    Behaviour: {
        AdditionalFileMapping: "vscord.behaviour.additionalFileMapping" as const,
        SuppressNotifications: "vscord.behaviour.suppressNotifications" as const,
        SuppressRpcCouldNotConnect: "vscord.behaviour.suppressRpcCouldNotConnect" as const,
        StatusBarAlignment: "vscord.behaviour.statusBarAlignment" as const,
        Debug: "vscord.behaviour.debug" as const
    } as const
} as const;
