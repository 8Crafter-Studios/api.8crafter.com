import { readdirSync, readFileSync, writeFileSync, type Dirent } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

const OLD_DROPDOWN_CODE: string = String.raw`elem1.innerHTML = "<label class=\"settings-label\" for=\"tsd-theme\" style=\"display: inline; position: unset\">API for: </label\n><select id=\"tsd-directory\" title=\"The Current API Documentation\" onchange=\"switch(this.value){\n    case 'home': window.open('../index.html', '_self'); break;\n    case 'andexdb': window.open('../andexdb/stable/index.html', '_self'); break;\n    case 'mcbe-leveldb': window.open('../mcbe-leveldb/stable/index.html', '_self'); break;\n}\">\n    <option value=\"home\">Home</option>\n    <option value=\"andexdb\">andexdb</option>\n    <option value=\"mcbe-leveldb\">mcbe-leveldb</option>\n</select>";`;
const NEW_DROPDOWN_CODE: string = String.raw`elem1.innerHTML = "<label class=\"settings-label\" for=\"tsd-theme\" style=\"display: inline; position: unset\">API for: </label\n><select id=\"tsd-directory\" title=\"The Current API Documentation\" onchange=\"switch(this.value){\n    case 'home': window.open('/', '_self'); break;\n    case 'andexdb': window.open('/andexdb', '_self'); break;\n    case 'mcbe-leveldb': window.open('/mcbe-leveldb', '_self'); break;\n}\">\n    <option value=\"home\">Home</option>\n    <option value=\"andexdb\">andexdb</option>\n    <option value=\"mcbe-leveldb\">mcbe-leveldb</option>\n</select>";`;

let replacements: bigint = 0n;

const APIDocsDirectories: string[] = readdirSync("./docs", { recursive: false, withFileTypes: true })
    .filter((directoryPath: Dirent<string>): boolean => directoryPath.isDirectory())
    .map((directoryPath: Dirent<string>): string => path.join(directoryPath.parentPath, directoryPath.name));

await Promise.all(
    APIDocsDirectories.map(
        async (APIDocsDirectory: string): Promise<void> =>
            readdir(APIDocsDirectory, { recursive: false, withFileTypes: true }).then(
                (directories: Dirent<string>[]): Promise<void> =>
                    Promise.all(
                        directories.map(async (directory: Dirent<string>): Promise<void> => {
                            if (!directory.isDirectory()) return;
                            return Promise.all(
                                (await readdir(path.join(APIDocsDirectory, directory.name), { recursive: true, withFileTypes: true })).map(
                                    async (file: Dirent<string>): Promise<void> => {
                                        if (!file.isFile()) return;
                                        const content: string = readFileSync(path.join(file.parentPath, file.name), "utf-8");
                                        const newContent: string = content.replace(OLD_DROPDOWN_CODE, NEW_DROPDOWN_CODE);
                                        if (content !== newContent) replacements++;
                                        writeFileSync(path.join(file.parentPath, file.name), newContent);
                                        console.log(`${APIDocsDirectory}/${directory.name}/${file.name}`);
                                    }
                                )
                            ).then((): void => {});
                        })
                    ).then((): void => {})
            )
    )
);

console.log(replacements);
