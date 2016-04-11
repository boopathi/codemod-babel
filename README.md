# codemod-babel

Some babel-plugins to transform code.

Work in progress.

To be used in command line for code mod. Not to be used during runtime.

### Aimed workflow

+ Use babel-cli along with these plugins
+ Replace the old code with the new code
+ Make necessary changes by hand
+ Review and commit

### require to import

**Package**: [require-to-import](./packages/babel-plugin-require-to-import)

**Example**:

+ [Input](./tests/resources/require-to-import.js)
+ [Output](./tests/resources/require-to-import.expected.js)

## LICENSE

http://boopathi.mit-license.org
