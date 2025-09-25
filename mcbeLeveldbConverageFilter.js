import { ReflectionKind } from "typedoc";

/**
 * Determines whether a reflection should be ignored when checking for documentation coverage.
 *
 * @param {import("typedoc").DeclarationReflection} ref
 * @returns {boolean} `true` if the reflection should be ignored, `false` otherwise.
 */
export function shouldIgnore(ref) {
    if (ref.kindOf(ReflectionKind.Property)) {
        if (
            (ref.getFullName().endsWith(".__type.type") ||
                ref.getFullName().endsWith(".__type.value") ||
                /__type\.value\.__type\.[^\.]+$/.test(ref.getFullName())) &&
            (ref.getFullName().startsWith("NBTSchemas.NBTSchemaTypes.") || ref.getFullName().startsWith("StructureSectionData."))
        ) {
            return true;
        }
        if (
            ref.getFullName().startsWith("NBTSchemas.nbtSchemas.") ||
            ref.getFullName().startsWith("<internal>.JSONSchema.") ||
            ref.getFullName().startsWith("NBTSchemas.GenericPrismarineJSONNBTSchema.") ||
            ref.getFullName().startsWith("BiomeData.") ||
            // ref.getFullName().startsWith("entryContentTypeToFormatMap.") ||
            /^entryContentTypeToFormatMap\.__type\.([^\.]+\.__type\.)+(type|bytes|format|signed)$/.test(ref.getFullName())
        ) {
            return true;
        }
    }
    return false;
}
