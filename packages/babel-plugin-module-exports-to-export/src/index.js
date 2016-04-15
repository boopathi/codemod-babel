export default function (babel) {
  const t = babel.types;

  const moduleExportsVisitor = {
    ExpressionStatement(statementPath) {
      const path = statementPath.get('expression');

      if (!path.isAssignmentExpression()) return;
      if (!t.isMemberExpression(path.node.left)) return;
      if (!t.isIdentifier(path.node.left.object)) return;
      if (!t.isIdentifier(path.node.left.property)) return;
      if (path.node.left.object.name !== 'module') return;
      if (path.node.left.property.name !== 'exports') return;

      if (path.scope.parent !== null)
        throw new Error(
          `module.exports is allowed only in the top level. Line ${path.node.right.loc.start.line}, Column ${path.node.right.loc.start.column} is not a top-level export`
        );

      if (this.nModuleExports++ > 0)
        throw new Error(
          `There should be only one module.exports`
        );

      const {right} = path.node;
      if (t.isIdentifier(right)) {
        if (path.scope.hasBinding(right.name)) {
          const binding = path.scope.getBinding(right.name);
          const targetNode = binding.path.node;
          if (t.isFunctionDeclaration(targetNode) || t.isClassDeclaration(targetNode) || t.isExpression(targetNode)) {
            binding.path.replaceWith(t.exportDefaultDeclaration(binding.path.node));
            path.remove();
          } else {
            statementPath.replaceWith(t.exportDefaultDeclaration(right));
          }
        } else {
          statementPath.replaceWith(t.exportDefaultDeclaration(right));
        }
      } else {
        statementPath.replaceWith(t.exportDefaultDeclaration(right));
      }
    }
  }

  const programVisitor = {
    Program(path) {
      const state = {
        nModuleExports: 0
      };
      path.traverse(moduleExportsVisitor, state);
    }
  }

  return {
    visitor: programVisitor
  };
}
