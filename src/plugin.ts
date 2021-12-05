import type babelCore from '@babel/core'
import { Expression } from "@babel/types";

type VisitorState = {
  file: {
    opts: babelCore.TransformOptions
  }
}

function consoleEventsPlugin(babel: typeof babelCore): babelCore.PluginObj<VisitorState> {
  const {types, template} = babel;

  return {
    name: "console-events-plugin",
    visitor: {
      CallExpression(path, state) {

        if (types.isMemberExpression(path.node.callee) &&
          types.isIdentifier(path.node.callee.object) && path.node.callee.object.name == "console" &&
          types.isIdentifier(path.node.callee.property) &&
          ['log', 'info', 'error', 'debug', 'warn'].includes(path.node.callee.property.name) &&
          types.isExpressionStatement(path.parentPath)
        ) {

          const fileName = state.file.opts.filename?.split('/').splice(-1)[0];
          const lineNumber = path.node.loc?.start.line

          const newNode = template(`
                              if (console.events) {
                                console.events.emit({
                                  type: TYPE,
                                  args: ARGS,
                                  loc: LOC,
                                });
                              }
                            `);
          path.insertAfter(newNode({
            TYPE: types.stringLiteral(path.node.callee.property.name),
            ARGS: types.arrayExpression(path.node.arguments as Expression[]),
            LOC: fileName && lineNumber
              ? types.arrayExpression([types.stringLiteral(fileName), types.stringLiteral(lineNumber.toString())])
              : types.nullLiteral(),
          }));
        }
      }
    }
  }
}

export default consoleEventsPlugin
