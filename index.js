import { Converter } from "./converter.js";
import fs from "fs-extra";
import path from "path";

const Config = {
  inputFolder: "./../next-saas-starter",
  outputFolder: "./../next-saas-starter-js",
  convertFileExtensions: [".ts", ".tsx"],
};

const inputFolder = Config.inputFolder;
const outputFolder = Config.outputFolder;

const convertFileExtensions = Config.convertFileExtensions;

const inputFiles = fs
  .readdirSync(inputFolder, {
    recursive: true,
  })
  .filter(
    (file) =>
      !(
        file.startsWith("dist/") ||
        file.startsWith("node_modules/") ||
        file.startsWith(".git")
      )
  );

console.log(inputFiles);

inputFiles.forEach((file) => {
  const filePath = path.join(inputFolder, file);
  if (convertFileExtensions.includes(path.extname(file))) {
    const fileContent = fs.readFileSync(filePath, "utf8");

    try {
      const convertedContent = Converter(fileContent);
      const outputFilePath = path.join(
        outputFolder,
        file.replace(".ts", ".js")
      );
      fs.outputFileSync(outputFilePath, convertedContent, "utf8");
    } catch (e) {
      console.log(`Cannot convert ${filePath}: ${e}`);
    }
  } else if (fs.statSync(filePath).isFile()) {
    const outputFilePath = path.join(outputFolder, file);

    try {
      fs.copySync(filePath, outputFilePath);
    } catch (e) {
      console.log(`Cannot copy ${filePath} -> ${outputFilePath}: ${e}`);
    }
  }
});
