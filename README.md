# stylelint-formatter-utils
Helpful utilities for building custom stylelint formatters.

## Install
```
npm install stylelint-formatter-utils
```

## Usage
The `stylelint-formatter-utils` module has the following exports:

### `gatherWarnings(results)`
Gathers all of the warnings for each file in the results array into a single
array, and decorates each warning with additional data:

1. `source` is the filename in which the warning occurred: the same value from
   the parent entry in the `results` array.
1. `links` is an object with the following keys:
    - `file` is the URL of the source file (at the current git ref).
    - `line` is the `file` URL with an anchor to the line that triggered the
      warning.
    - `rule` is a link to the rule documentation on
      [stylelint.io](https://stylelint.io), which will not be valid for rules
      defined in third party plugins.

Use this function to prep your data for formatting with a [Table](#table):

```js
const {gatherWarnings, Table} = require('stylelint-formatter-utils')

module.exports = function tableFormatter(results) {
  const rows = gatherWarnings(results)
  const table = new Table({columns: [ /* ... */ ]})
  return table.format(rows)
}
```

### `Table`
This is a class for outputting tabular data, which is expected to be an array
of objects with a uniform shape. The constructor takes an options object with
the following keys:

- `delimiter` (default: tab) is the string to output between cells
- `lineDelimiter` (default: newline) is the string to output between rows
- `beforeLine` is the optional string to output at the beginning of each row
- `afterLine` is the optional string to output at the end of each row
- `beforeHeaderFill` is the optional string with which to fill a
  row between the header and the first row of data
- `afterHeaderFill` is the optional string with which to fill a
  row between the header and the first row of data


```js
const {Table} = require('stylelint-formatter-utils')
const table = new Table({
  delimiter: ',',
  columns: ['source', 'line']
})
console.log(table.format([
  {source: 'x.css', line: 10},
  {source: 'y.css', line: 5}
])
// outputs:
// source,line
// x.css,10
// y.css,5
```

Want to generate a Markdown table? Get it from the [markdown exports](#markdown).


## `getHeadRef()`
Get the git head ref, which is useful for generating links to source code.

```js
const {getHeadRef} = require('stylelint-formatter-utils')
const {repository} = require('./package.json')
const head = getHeadRef()
console.log(`browse this ref: https://github.com/${repository}/tree/${ref}`)
```

## `getRepoURL()`
Get the repo URL from the git origin remote.

```js
const {getRepoURL} = require('stylelint-formatter-utils')
console.log(`check out this repo: ${getRepoURL()}`)
```

## `stripCwd(path[, cwd])`
Strip the current working directory from the lefthand side of the input `path`.
If `cwd` is not provided or empty, we get it from `process.cwd()`.

```js
const {stripCwd} = require('stylelint-formatter-utils')
console.log(`this file is: ${stripCwd(__filename)}`)
```

## Markdown
You can get a couple of Markdown-specific helpers from the `stylelint-formatter-utils/markdown` endpoint:

### `MarkdownTable`

```js
const {MarkdownTable, link} = require('stylelint-formatter-utils/markdown')
const table = new MarkdownTable({
  columns: [
    {title: 'rule', format: ({rule}) => {
      return link(rule, `https://stylelint.io/user-guide/rules/${rule}`)
    }},
    {title: 'path', format: ({source, line}) => {
      return link(`${source}@${line}`, `https://github.com/my/repo/blob/master/${source}#L${line}`)
    }}
  ]
})
```

### `markdown.link(text, url)`
Returns a Markdown link in the format `[text](url)`.

### `markdown.code(text)`
Returns the string wrapped in backticks.
