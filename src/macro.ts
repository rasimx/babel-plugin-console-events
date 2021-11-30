import { createMacro, MacroHandler, MacroParams } from 'babel-plugin-macros'
import { NodePath, types } from "@babel/core";
const consoleEventsMacro: MacroHandler = ({ references, state, babel }: MacroParams): void =>{
  const { default: defaultImport = [], log = [], info = [], error = [], warn = [], debug = [] } = references

  const templateFactory = (referencePath: NodePath<types.Node>) => {
    const fileName = state.file.opts.filename?.split('/').splice(-1)[0];
    const lineNumber = referencePath.node.loc?.start.line

    const newNodesFactory = babel.template(`
      console.METHOD(ARGS);
      if (console.events) {
        console.events.emit({
          type: TYPE,
          args: ARGS,
          loc: LOC,
        });
      }
    `);

    if ("name" in referencePath.node) {
      const newNodes = newNodesFactory({
        METHOD: referencePath.node,
        ARGS: types.arrayExpression(
          (referencePath.parentPath?.node as types.CallExpression).arguments as Array<types.Expression>
        ),
        TYPE: types.stringLiteral(referencePath.node.name as string),
        LOC: fileName && lineNumber
          ? types.arrayExpression([types.stringLiteral(fileName), types.numericLiteral(lineNumber)])
          : types.nullLiteral(),
      })
      referencePath.parentPath?.replaceWithMultiple(newNodes as types.Statement[]);
    }
  }

  log.forEach(templateFactory)
  info.forEach(templateFactory)
  warn.forEach(templateFactory)
  error.forEach(templateFactory)
  debug.forEach(templateFactory)
}


export const log: (...args: any[]) => void = null as any;
export const info: (...args: any[]) => void = null as any;
export const warn: (...args: any[]) => void = null as any;
export const error: (...args: any[]) => void = null as any;
export const debug: (...args: any[]) => void = null as any;

export default createMacro(consoleEventsMacro)