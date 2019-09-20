const defaults = {
  columns: [],
  delimiter: '\t',
  lineDelimiter: '\n',
  beforeLine: '',
  afterLine: ''
}

module.exports = class Table {
  constructor(options = {}) {
    Object.assign(this, defaults, options)
  }

  header() {
    let header = this.columns.map(column => this.heading(column)).join(this.delimiter)
    header = this.wrapLine(header)
    if (this.beforeHeaderFill) {
      const before = this.columns.map(() => this.beforeHeaderFill).join(this.delimiter)
      header = this.wrapLine(before) + this.lineDelimiter + header
    }
    if (this.afterHeaderFill) {
      const after = this.columns.map(() => this.afterHeaderFill).join(this.delimiter)
      header += this.lineDelimiter + this.wrapLine(after)
    }
    return header
  }

  heading(column) {
    return typeof column === 'string' ? column : column.title
  }

  row(row) {
    const cells = this.columns.map(column => this.cell(column, row))
    const content = cells.map(cell => this.escape(cell)).join(this.delimiter)
    return this.wrapLine(content)
  }

  wrapLine(content) {
    return `${this.beforeLine || ''}${content}${this.afterLine || ''}`
  }

  cell(column, row) {
    if (typeof column === 'string') {
      return row[column]
    } else if (typeof column.key === 'string') {
      return row[column.key]
    } else if (typeof column.format === 'function') {
      return column.format(row, column)
    }
  }

  escape(str) {
    return String(str).replace(new RegExp(`${this.delimiter}`, 'g'), ' ')
  }

  format(rows) {
    return [this.header(), ...rows.map(row => this.row(row))].join(this.lineDelimiter)
  }
}
