import type babelCore from '@babel/core'
import { types } from "@babel/core";

type VisitorState = {
  file: {
    opts: babelCore.TransformOptions
  }
}

function consoleEventsPlugin(babel: typeof babelCore): babelCore.PluginObj<VisitorState> {
  const {types: t, template} = babel;

  return {
    name: "console-events-plugin",
    visitor: {
      CallExpression(path, state) {

        if (t.isMemberExpression(path.node.callee) &&
          t.isIdentifier(path.node.callee.object) && path.node.callee.object.name == "console" &&
          t.isIdentifier(path.node.callee.property) &&
          ['log', 'info', 'error', 'debug', 'warn'].includes(path.node.callee.property.name) &&
          t.isExpressionStatement(path.parentPath)
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
            TYPE: t.stringLiteral(path.node.callee.property.name),
            ARGS: t.arrayExpression(path.node.arguments as Array<types.Expression>),
            LOC: fileName && lineNumber
              ? t.arrayExpression([t.stringLiteral(fileName), t.stringLiteral(lineNumber.toString())])
              : types.nullLiteral(),
          }));
        }
      }
    }
  }
}

export default consoleEventsPlugin
