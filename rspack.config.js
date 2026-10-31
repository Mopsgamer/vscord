//@ts-check

"use strict";

const path = require("node:path");
const fs = require("node:fs");
const { styleText: c } = require("node:util");

//@ts-check
/** @typedef {import('@rspack/core').Configuration} RspackConfig **/

// ---------------------------------------------------------------------------
// ConfigTypes Plugin – generates src/@types/configtypes.d.ts from package.json
// ---------------------------------------------------------------------------

const ROOT = __dirname;
const PACKAGE_JSON = path.join(ROOT, "package.json");
const OUT_FILE = path.join(ROOT, "src", "@types", "configtypes.d.ts");
const OUT_FILE_REL = path.relative(ROOT, OUT_FILE);

/** @param {{ type?: string | string[], enum?: any[], items?: object, additionalProperties?: object, properties?: Record<string,object>, propertyNames?: object }} schema @param {number} [nesting] @returns {string} */
function schemaTypeToTs(schema, nesting = 1) {
    if (!schema) return "unknown";
    if (Array.isArray(schema.type)) {
        return schema.type.map((t) => schemaTypeToTs({ type: t })).join(" | ");
    }
    if (schema.enum) {
        return schema.enum.map((v) => JSON.stringify(v)).join(" | ");
    }
    switch (schema.type) {
        case "boolean": return "boolean";
        case "string":  return "string";
        case "number":  return "number";
        case "array": {
            const itemType = schema.items ? schemaTypeToTs(/** @type {any} */ (schema.items)) : "unknown";
            return itemType.includes("|") ? `(${itemType})[]` : `${itemType}[]`;
        }
        case "object": {
            if (!schema.additionalProperties && !schema.properties && !schema.propertyNames) {
                return "Record<string, unknown>";
            }
            const spaceZero = "    ".repeat(nesting);
            const space = spaceZero + "    ";
            let obj = "{\n";
            if (schema.additionalProperties) {
                obj += space + `[key: string]: ${schemaTypeToTs(/** @type {any} */ (schema.additionalProperties))};\n`;
            }
            if (schema.properties) {
                for (const prop in schema.properties) {
                    obj += space + `${prop}: ${schemaTypeToTs(/** @type {any} */ (schema.properties[prop]), nesting + 1)};\n`;
                }
            }
            obj += spaceZero + "}";
            return obj;
        }
        default: return "unknown";
    }
}

/** @param {{ deprecationMessage?: string, markdownDeprecationMessage?: string }} schema @returns {string | null} */
function getDeprecation(schema) {
    if (schema.deprecationMessage) return schema.deprecationMessage;
    if (schema.markdownDeprecationMessage) {
        return schema.markdownDeprecationMessage
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .replace(/[`#*]/g, "");
    }
    return null;
}

/**@typedef {{ check?: boolean }} ConfigTypesOptions */

/**
 * Generates src/@types/configtypes.d.ts.
 * @param {ConfigTypesOptions} [opts]
 */
function generateConfigTypes(opts = {}) {
    const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, "utf8"));
    const configurations = pkg.contributes?.configuration ?? [];

    const activeEntries = [];
    const deprecatedEntries = [];

    for (const block of configurations) {
        const props = block.properties ?? {};
        for (const [key, schema] of Object.entries(props)) {
            const tsType = schemaTypeToTs(/** @type {any} */ (schema));
            const deprecation = getDeprecation(/** @type {any} */ (schema));
            if (deprecation) {
                deprecatedEntries.push(`    /** @deprecated ${deprecation} */`);
                deprecatedEntries.push(`    ${JSON.stringify(key)}: ${tsType};`);
            } else {
                activeEntries.push(`    ${JSON.stringify(key)}: ${tsType};`);
            }
        }
    }

    const output = `// AUTO-GENERATED FILE
// DO NOT EDIT MANUALLY
// Edit package.json instead and re-run the build to update
// Generated from package.json contributes.configuration

export type ExtensionConfigGenerated = {
${activeEntries.join("\n")}
};

export type DeprecatedConfigGenerated = {
${deprecatedEntries.join("\n")}
};
`;

    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });

    if (opts.check) {
        const existing = fs.existsSync(OUT_FILE) ? fs.readFileSync(OUT_FILE, "utf8") : null;
        if (existing !== output) {
            console.log("Checked", OUT_FILE_REL, "and it is", c(["red", "bold"], "out of date."));
            console.log("Regenerate by running the build or 'node --run typegen'.");
            process.exitCode = 1;
        } else {
            console.log("Checked", OUT_FILE_REL, c(["green", "bold"], "successfully"));
        }
    } else {
        fs.writeFileSync(OUT_FILE, output, "utf8");
        console.log("Generated", OUT_FILE_REL, c(["green", "bold"], "successfully"));
    }
}

/** @type {(opts: ConfigTypesOptions) => import('@rspack/core').RspackPluginInstance} */
const ConfigTypesPlugin = (opts) => ({
    apply(compiler) {
        compiler.hooks.beforeRun.tap("ConfigTypesPlugin", () => generateConfigTypes(opts));
        compiler.hooks.watchRun.tap("ConfigTypesPlugin", () => generateConfigTypes(opts));
    },
});

// ---------------------------------------------------------------------------

/** @type RspackConfig */
module.exports = (env = { configtypes: "gen" }) => {
const extensionConfig = {
    plugins: [ConfigTypesPlugin({check: env.configtypes === "check"})],
    target: "node", // VS Code extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
    mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

    entry: "./src/extension.ts", // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
    output: {
        // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
        path: path.resolve(__dirname, "dist"),
        filename: "extension.js",
        library: {
            type: "commonjs2"
        }
    },
    externals: {
        vscode: "commonjs vscode" // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
        // modules added here also need to be added in the .vscodeignore file
    },
    resolve: {
        // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "builtin:swc-loader",
                        options: {
                            jsc: {
                                parser: {
                                    syntax: "typescript"
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    devtool: "nosources-source-map",
    infrastructureLogging: {
        level: "log" // enables logging required for problem matchers
    },
    ignoreWarnings: [/bufferutil/, /utf-8-validate/]
};
return [extensionConfig];
}
