import { readdirSync, readFileSync, writeFileSync, type Dirent } from "node:fs";
import path from "node:path";

const OLD_DROPDOWN_CODE: string = String.raw`elem1.innerHTML = "<label class=\"settings-label\" for=\"tsd-theme\" style=\"display: inline; position: unset\">API for: </label\n><select id=\"tsd-directory\" title=\"The Current API Documentation\" onchange=\"switch(this.value){\n    case 'home': window.open('../index.html', '_self'); break;\n    case 'andexdb': window.open('../andexdb/stable/index.html', '_self'); break;\n    case 'mcbe-leveldb': window.open('../mcbe-leveldb/stable/index.html', '_self'); break;\n}\">\n    <option value=\"home\">Home</option>\n    <option value=\"andexdb\">andexdb</option>\n    <option value=\"mcbe-leveldb\">mcbe-leveldb</option>\n</select>";`;
const NEW_DROPDOWN_CODE: string = String.raw`elem1.innerHTML = "<label class=\"settings-label\" for=\"tsd-theme\" style=\"display: inline; position: unset\">API for: </label\n><select id=\"tsd-directory\" title=\"The Current API Documentation\" onchange=\"switch(this.value){\n    case 'home': window.open('/', '_self'); break;\n    case 'andexdb': window.open('/andexdb', '_self'); break;\n    case 'mcbe-leveldb': window.open('/mcbe-leveldb', '_self'); break;\n}\">\n    <option value=\"home\">Home</option>\n    <option value=\"andexdb\">andexdb</option>\n    <option value=\"mcbe-leveldb\">mcbe-leveldb</option>\n</select>";`;

let replacements: bigint = 0n;

for (const APIDocsDirectory of readdirSync("./docs", { recursive: false, withFileTypes: true })
    .filter((directoryPath: Dirent<string>): boolean => directoryPath.isDirectory())
    .map((directoryPath: Dirent<string>): string => path.join(directoryPath.parentPath, directoryPath.name))) {
    readdirSync(APIDocsDirectory, { recursive: false, withFileTypes: true }).forEach((directory: Dirent<string>): void => {
        if (!directory.isDirectory()) return;
        readdirSync(path.join(APIDocsDirectory, directory.name), { recursive: true, withFileTypes: true }).forEach((file: Dirent<string>): void => {
            if (!file.isFile()) return;
            const content: string = readFileSync(path.join(file.parentPath, file.name), "utf-8");
            const newContent: string = content.replace(OLD_DROPDOWN_CODE, NEW_DROPDOWN_CODE);
            if (content !== newContent) replacements++;
            writeFileSync(path.join(file.parentPath, file.name), newContent);
        });
    });
}

console.log(replacements);
