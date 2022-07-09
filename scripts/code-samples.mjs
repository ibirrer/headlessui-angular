"use strict";

import { promises as fs } from "fs";
import Prism from "prismjs";

const rootPath = "./projects/demo/src/app/demo-components";

const components = (await fs.readdir(rootPath, { withFileTypes: true }))
  .filter((item) => item.isDirectory())
  .map((item) => item.name);

const lines = await Promise.all(
  components.map(async (component) => {
    const variableName = component.replace(/-[a-z]/g, (x) =>
      x[1].toUpperCase()
    );

    const htmlFilePath = `${rootPath}/${component}/${component}.component.html`;
    const tsFilePath = `${rootPath}/${component}/${component}.component.ts`;
    const htmlFileSource = await fs.readFile(htmlFilePath, "utf8");
    const tsFileSource = await fs.readFile(tsFilePath, "utf8");
    const htmlFileSourceFormatted = highlight(htmlFileSource, "html");
    const tsFileSourceFormatted = highlight(tsFileSource, "ts");
    const htmlLine = `export const ${variableName}Html = \`${htmlFileSourceFormatted}\``;
    const tsLine = `export const ${variableName}Typescript = \`${tsFileSourceFormatted}\``;
    return [htmlLine, tsLine];
  })
);

await fs.writeFile(
  "./projects/demo/src/app/formattedSources.ts",
  lines.flat().join("\n")
);

function highlight(source, type) {
  let lang = Prism.languages.javascript;
  if (type === "html") {
    lang = Prism.languages.html;
  }

  return Prism.highlight(source, lang, type)
    .replaceAll(/\r\n|\r|\n/g, "\\n")
    .replaceAll("`", "\\`");
}
