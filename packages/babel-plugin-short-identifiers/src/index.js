export default function ({types: t}) {

  let state = [];

  const identifierVistor = {
    
    Identifier(path) {
      let newIdentifier = path.node.name.charAt(0);
      if (!checkIfkeyExists(state, newIdentifier)) {
        state.push(newIdentifier);
        path.node.name = newIdentifier;
      }
    }
  };

  const checkIfkeyExists = (state, key) => {
    state.map((x) => {
        if (x === key) {
          return true;
        }
    });
    return false;
  };

  return {
    visitor: identifierVistor
  };
}
