# codemod-babel

Some babel-plugins to transform code.

Work in progress.

To be used in command line for code mod. Not to be used during runtime.

### Aimed workflow

+ Use babel-cli along with these plugins
+ Replace the old code with the new code
+ Make necessary changes by hand
+ Review and commit

## Packages

Transformation | Example Input | Example output
--- | --- | ---
[require-to-import](./packages/babel-plugin-require-to-import) | [Input](./tests/resources/require-to-import.js) | [Output](./tests/resources/require-to-import.expected.js)

## LICENSE

https://boopathi.mit-license.org/2015
