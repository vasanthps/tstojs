import { parse, print } from "recast";
import { transformFromAstSync } from "@babel/core";
import transformTypescript from "@babel/plugin-transform-typescript";
import pkg from "recast/parsers/_babel_options.js";
import { parser } from "recast/parsers/babel.js";

const getBabelOptions = pkg.default;
export const Converter = (inputText) => {
  try {
    const ast = parse(inputText, {
      parser: {
        parse: (source, options) => {
          const babelOptions = getBabelOptions(options);
          babelOptions.plugins.push("typescript", "jsx");
          return parser.parse(source, babelOptions);
        },
      },
    });

    const options = {
      cloneInputAst: false, // recast stores metadata in AST nodes, so disable cloning will preserve the original code style
      code: false,
      ast: true,
      plugins: [transformTypescript],
      configFile: false,
    };
    const { ast: transformedAST } = transformFromAstSync(
      ast,
      inputText,
      options
    );
    const result = print(transformedAST).code;

    return result;
  } catch (e) {
    console.log(e);

    throw e;
  }
};
