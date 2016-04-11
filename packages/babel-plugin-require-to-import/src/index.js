function getIdentifierFromLiteral(name) {
  return name
    .replace(/[^\w\s]/gi, '-')
    .replace(/-([a-z])/g, g => g[1].toUpperCase());
}

export default function babelPluginRequireToImport(babel) {
  const t = babel.types;

  const requireVisitor = {
    CallExpression(path) {
      if (!t.isIdentifier(path.node.callee)) return;
      if (path.node.callee.name !== 'require') return;
      if (!t.isStringLiteral(path.node.arguments[0])) return;

      if (path.scope.parent !== null)
        throw new Error(
          `Requires must be top level. "${path.node.arguments[0].value}" is not required in the top-level`
        );

      const value = path.node.arguments[0].value;

      if (t.isVariableDeclarator(path.parentPath.node)) {
        const id = path.parentPath.node.id.name;
        this.imports.push({id, value});
        return path.parentPath.remove();
      }

      // a CallExpression will have second ancestor as program
      // even if declared in the highest scope
      // Program -> body(ExpressionStatement) -> CallExpression
      let variableDeclarator = path.parentPath.parentPath;
      while (true) {
        if (t.isVariableDeclarator(variableDeclarator.node)) {
          const id = '$' + variableDeclarator.node.id.name;
          this.imports.push({id, value});
          return path.replaceWith(t.identifier(id));
        }
        if (t.isProgram(variableDeclarator.node)) {
          // no variable declarator found
          const id = '$' + getIdentifierFromLiteral(value);
          this.imports.push({id, value});
          return path.replaceWith(t.identifier(id));
        }
        variableDeclarator = variableDeclarator.parentPath;
      }
    }
  }

  const bodyVisitor = {
    Program(path) {
      // a mutable state that's altered by child visitors
      let state = {
        imports: []
      };

      path.traverse(requireVisitor, state);

      let importDecls = [];
      state.imports.map(o => {
        // reverse insert
        importDecls.unshift(
          t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier(o.id))],
            t.stringLiteral(o.value)
          )
        );
      });
      // reverse insert from head to get correct order
      importDecls.map(imp => path.node.body.unshift(imp));

    }
  }

  return {
    visitor: bodyVisitor
  };
}
