export default function ({types: t}) {


  const isNotChangable = (path, state) => {

    //check if exisits in state
    if (state && state.has(path.node.name)) {
      return false;
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

    // Globals
    if (path.scope.hasGlobal(path.node.name)) {
      return true;
    }

    // object destructor
    if (t.isObjectPattern(path.parentPath.parentPath.node)) {
      return true;
    }

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
      if (isNotChangable(path, this)) {
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
