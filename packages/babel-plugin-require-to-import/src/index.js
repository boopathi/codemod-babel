export default function babelPluginRequireToImport(babel) {
  const t = babel.types;
  
  const requireVisitor = {
    CallExpression(path) {
      if (path.node.callee.name !== "require") return;
      if (!t.isStringLiteral(path.node.arguments[0])) return;
      
      const value = path.node.arguments[0].value;
      
      let variableDeclarator = path.parentPath;
      while (!t.isVariableDeclarator(variableDeclarator.node)) {
        variableDeclarator = variableDeclarator.parentPath;
      }
      
      // subjected to change
      let id = variableDeclarator.node.id.name;
      
      if (t.isVariableDeclarator(path.parentPath.node)) {
        path.parentPath.remove();
      } else {
        id = '$' + id;
        path.replaceWith(t.identifier(id));
      }
      
      this.imports.push({id, value});

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