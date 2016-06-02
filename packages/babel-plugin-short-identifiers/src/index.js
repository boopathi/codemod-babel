function* atoz() {
  yield* 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
}

function* NameGenerator() {
  let i = 0;
  while (true) {
    if (i) for (let j of atoz()) yield j+i;
    else yield* atoz();
    i++;
  }
}

export default function ({types: t}) {

  function renameIdentifiers(path) {
    const bindings = path.scope.getAllBindings();
    const ownBindings = Object.keys(bindings).filter(b => path.scope.hasOwnBinding(b));

    let names = NameGenerator();

    ownBindings.map(b => {
      path.scope.rename(b, names.next().value);
    });

  }

  /**
   * Things that have scope / bindings for the scope
   *
   * Program
   * ArrowFunctionExpression
   * FunctionExpression
   * FunctionDeclaration
   * BlockStatement*
   *
   * We can only worry about BlockStatement and Program and ignore others
   *
   */

  return {
    visitor: {
      Program(path) {
        renameIdentifiers(path);
      },
      BlockStatement(path) {
        renameIdentifiers(path);
      }
    }
  };
}
