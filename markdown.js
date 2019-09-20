const Table = require('./table')

const tableOptions = {
  delimiter: ' | ',
  beforeLine: '| ',
  afterLine: ' |',
  afterHeaderFill: ':---'
}

class MarkdownTable extends Table {
  constructor(options) {
    super(Object.assign({}, tableOptions, options))
  }
}

module.exports = {
  tableOptions,
  MarkdownTable,
  link,
  code
}

function link(text, url) {
  return `[${text}](${url})`
}

function code(str) {
  return `\`${str}\``
}
