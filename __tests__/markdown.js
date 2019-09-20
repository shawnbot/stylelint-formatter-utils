const {MarkdownTable, link} = require('../markdown')

describe('MarkdownTable', () => {
  it('builds a table', () => {
    const table = new MarkdownTable({columns: ['foo', 'bar']})
    expect(table.format([{foo: 1, bar: 2}, {foo: 3, bar: 4}])).toEqual(
      `| foo | bar |
| :--- | :--- |
| 1 | 2 |
| 3 | 4 |`
    )
  })
})

describe('markdown.link()', () => {
  it('does the thing', () => {
    expect(link('hi', 'https://example.com')).toEqual('[hi](https://example.com)')
  })
})

