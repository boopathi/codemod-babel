export default function (babel) {
  const t = babel.types;

  const moduleExportsVisitor = {
    AssignmentExpression(path) {
      if (!t.isMemberExpression(path.node.left)) return;
      if (!t.isIdentifier(path.node.left.object)) return;
      if (!t.isIdentifier(path.node.left.property)) return;
      if (path.node.left.object.name !== 'module') return;
      if (path.node.left.property.name !== 'exports') return;

      const {right} = path.node;
      if (t.isIdentifier(right)) {
        const binding = path.scope.getBinding(right.name);
        const targetNode = binding.path.node;

        if (t.isFunctionDeclaration(targetNode) || t.isClassDeclaration(targetNode) || t.isExpression(targetNode)) {
          binding.path.replaceWith(t.exportDefaultDeclaration(binding.path.node));
          path.remove();
        } else {
          path.parentPath.replaceWith(t.exportDefaultDeclaration(right));
        }
      } else {
        path.parentPath.replaceWith(t.exportDefaultDeclaration(right));
      }
    }
  }
  return {
    visitor: moduleExportsVisitor
  };
}
