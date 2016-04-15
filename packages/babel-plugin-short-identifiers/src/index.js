export default function ({types: t}) {


  const isNotChangable = (path) => {
    // Globals
    if (path.scope.hasGlobal(path.node.name)) {
      return true;
    }
    // import {component}
    if (t.isImportSpecifier(path.parentPath.node)) {
      // import {Component as myComponent}
      if (path.parentKey === 'local') {
        return false;
      }
      return true;
    }

    // exports {component}
    if (t.isExportSpecifier(path.parentPath.node)) {
      // export {Component as myComponent}
      if (path.parentKey === 'local') {
        return false;
      }
      return true;
    }

    // object descructor

    // object expression

    //class methods and object methods

      return false;
  }

  const identifierReplaceVisitor = {
    Identifier(path) {
      if (isNotChangable(path)) {
        return;
      }
      path.node.name = this[path.node.name];
    }
  }

  const identifierGrabVistor = {
    Identifier(path) {
      if (isNotChangable(path)) {
        return;
      }
      this.add(path.node.name);
    }
  };

  function* nameGen() {
    yield* 'abcdefghijklmnopqrstuvwxyz'.split('');
  }

  return {
    visitor: {
      Program(path) {
        let state = new Set();
        let newState = {};
        let it = nameGen();

        path.traverse(identifierGrabVistor, state);
        for(let item of state) {
          newState[item] = it.next().value;
        }
        path.traverse(identifierReplaceVisitor, newState);
      }
    }
  };
}
