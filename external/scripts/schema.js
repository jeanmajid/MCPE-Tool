import fs from "fs";

export class SchemaGenerator {
    static generateFromFile(filePath, interfaceName, outputPath) {
        const fileContent = fs.readFileSync(filePath, "utf-8");

        const interfaceRegex = new RegExp(
            `export interface ${interfaceName}\\s*{([^}]*(?:{[^}]*}[^}]*)*)}`,
            "s"
        );

        const match = fileContent.match(interfaceRegex);
        if (!match) {
            throw new Error(`Interface ${interfaceName} not found`);
        }

        const interfaceBody = match[1];
        const properties = this.parseProperties(interfaceBody);

        const schema = {
            $schema: "http://json-schema.org/draft-07/schema#",
            title: `MC ${interfaceName} Schema`,
            description: `Auto-generated schema for mc ${interfaceName}`,
            type: "object",
            properties: this.buildSchemaProperties(properties),
            required: this.getRequiredFields(properties),
            additionalProperties: false
        };

        if (outputPath) {
            fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
            console.log(`✅ Schema generated: ${outputPath}`);
        }

        return schema;
    }

    static parseProperties(interfaceBody) {
        const properties = {};
        let currentComment = "";

        const lines = interfaceBody.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.startsWith("/**")) {
                currentComment = line
                    .replace(/^\/?\*+\s*/, "")
                    .replace(/\*\/$/, "")
                    .trim();
                continue;
            }

            const propMatch = line.match(/^(\w+)(\?)?:\s*(.+);?\s*$/);
            if (propMatch) {
                const [, propName, optional, propType] = propMatch;

                if (propType.trim() === "{") {
                    const nestedProps = this.parseNestedObject(lines, i + 1);
                    properties[propName] = {
                        type: "object",
                        optional: !!optional,
                        description: currentComment,
                        isNested: true,
                        nestedProperties: nestedProps.properties
                    };
                    i = nestedProps.endIndex;
                } else {
                    properties[propName] = {
                        type: propType.replace(";", "").trim(),
                        optional: !!optional,
                        description: currentComment
                    };
                }
                currentComment = "";
            }
        }

        return properties;
    }

    static parseNestedObject(lines, startIndex) {
        const properties = {};
        let currentComment = "";
        let braceCount = 1;
        let i = startIndex;

        while (i < lines.length && braceCount > 0) {
            const line = lines[i].trim();

            if (line.includes("{")) braceCount++;
            if (line.includes("}")) braceCount--;

            if (braceCount === 0) break;

            if (line.startsWith("*")) {
                const comment = line.replace(/^\*\s*/, "").trim();
                if (comment) currentComment = comment;
                i++;
                continue;
            }

            const propMatch = line.match(/^(\w+)(\?)?:\s*(.+);?\s*$/);
            if (propMatch) {
                const [, propName, optional, propType] = propMatch;
                properties[propName] = {
                    type: propType.replace(";", "").trim(),
                    optional: !!optional,
                    description: currentComment
                };
                currentComment = "";
            }

            i++;
        }

        return { properties, endIndex: i };
    }

    static buildSchemaProperties(properties) {
        const schemaProps = {
            $schema: {
                type: "string"
            }
        };

        for (const [propName, propInfo] of Object.entries(properties)) {
            const schemaProp = {};

            if (propInfo.description) {
                schemaProp.description = propInfo.description;
            }

            if (propInfo.isNested && propInfo.nestedProperties) {
                schemaProp.type = "object";
                schemaProp.properties = this.buildSchemaProperties(propInfo.nestedProperties);
                schemaProp.required = this.getRequiredFields(propInfo.nestedProperties);
                schemaProp.additionalProperties = false;
            } else {
                this.setPropertyType(schemaProp, propInfo.type);
            }

            schemaProps[propName] = schemaProp;
        }

        return schemaProps;
    }

    static setPropertyType(schemaProp, tsType) {
        if (tsType === "string") {
            schemaProp.type = "string";
        } else if (tsType === "number") {
            schemaProp.type = "number";
        } else if (tsType === "boolean") {
            schemaProp.type = "boolean";
        } else if (tsType === "string[]") {
            schemaProp.type = "array";
            schemaProp.items = { type: "string" };
            schemaProp.uniqueItems = true;
        } else if (tsType.includes("|")) {
            const enumValues = tsType
                .split("|")
                .map((v) => v.trim().replace(/['"]/g, ""))
                .filter((v) => v !== "");
            schemaProp.type = "string";
            schemaProp.enum = enumValues;
        } else {
            schemaProp.type = "string";
        }
    }

    static getRequiredFields(properties) {
        return Object.entries(properties)
            .filter(([, propInfo]) => !propInfo.optional)
            .map(([propName]) => propName);
    }
}

SchemaGenerator.generateFromFile(
    "src/core/config/configManager.ts",
    "Config",
    "src/core/config/mcConfigSchema.json"
);
