const Table = require('../table')

describe('Table', () => {
  it('builds TSV by default', () => {
    const table = new Table({columns: ['foo', 'bar']})
    expect(table.format([{foo: 1, bar: 2}, {foo: 3, bar: 4}])).toEqual(
      `foo\tbar
1\t2
3\t4`
    )
  })

  it('can format columns by key', () => {
    const table = new Table({columns: [
      {title: 'Foo', key: 'foo'},
      {title: 'Bar', key: 'bar'}
    ]})
    expect(table.format([{foo: 1, bar: 2}, {foo: 3, bar: 4}])).toEqual(
      `Foo\tBar
1\t2
3\t4`
    )
  })

  it('can format columns with a format() function', () => {
    const table = new Table({columns: [
      {title: 'Foo', format: d => d.foo + 1},
      {title: 'Bar', format: d => d.bar + 1}
    ]})
    expect(table.format([{foo: 1, bar: 2}, {foo: 3, bar: 4}])).toEqual(
      `Foo\tBar
2\t3
4\t5`
    )
  })
})
