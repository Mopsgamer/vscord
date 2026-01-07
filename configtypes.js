const fs = require("fs"); // should be changed to import
const path = require("path");

const ROOT = process.cwd();
const PACKAGE_JSON = path.join(ROOT, "package.json");
const OUT_FILE = path.join(ROOT, "src", "configtype.ts");

const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, "utf8"));

const configurations = pkg.contributes?.configuration ?? [];

function schemaTypeToTs(schema) {
    if (!schema) return "unknown";

    if (Array.isArray(schema.type)) {
        return schema.type.map((t) => schemaTypeToTs({ type: t })).join(" | ");
    }

    if (schema.enum) {
        return schema.enum.map((v) => JSON.stringify(v)).join(" | ");
    }

    switch (schema.type) {
        case "boolean":
            return "boolean";
        case "string":
            return "string";
        case "number":
            return "number";
        case "array": {
            const itemType = schema.items ? schemaTypeToTs(schema.items) : "unknown";
            const needsParens = itemType.includes("|");
            return needsParens ? `(${itemType})[]` : `${itemType}[]`;
        }
        case "object": {
            if (schema.additionalProperties) {
                const valueType = schemaTypeToTs(schema.additionalProperties);
                return `{ [key: string]: ${valueType} }`;
            }
            return "Record<string, unknown>";
        }
        default:
            return "unknown";
    }
}

const entries = [];

for (const block of configurations) {
    const props = block.properties ?? {};
    for (let [key, schema] of Object.entries(props)) {
        key = JSON.stringify(key);
        const tsType = schemaTypeToTs(schema);
        entries.push(`    ${key}: ${tsType};`);
    }
}

const output = `/* AUTO-GENERATED FILE
 * DO NOT EDIT MANUALLY
 * Generated from package.json contributes.configuration
 */

export type ExtensionConfigGenerated = {
${entries.join("\n")}
};
`;

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
if (process.argv.includes("--check")) {
    const existing = fs.existsSync(OUT_FILE) ? fs.readFileSync(OUT_FILE, "utf8") : null;
    if (existing === null) {
        console.warn("missing", OUT_FILE);
    } else if (existing !== output) {
        console.log("up to date", OUT_FILE);
    }
    console.log("checked", OUT_FILE);
} else {
    fs.writeFileSync(OUT_FILE, output, "utf8");
    console.log("generated", OUT_FILE);
}
