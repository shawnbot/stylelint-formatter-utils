const utils = require('..')
const {spawnSync} = require('child_process')

const thisRepoURL = 'https://github.com/shawnbot/stylelint-formatter-utils'

jest.mock('child_process')
spawnSync.mockImplementation(() => ({
  stdout: 'abc123'
}))

describe('gatherWarnings()', () => {
  it('gets all the warnings', () => {
    const results = [
      {
        source: 'foo.css',
        warnings: [
          {line: 20, rule: 'derp', text: 'hi'}
        ]
      },
      {
        source: 'bar.css',
        warnings: [
          {line: 1, rule: 'beep', text: 'boop'}
        ]
      }
    ]
    expect(utils.gatherWarnings(results)).toHaveLength(2)
  })

  it('sets warning.source', () => {
    const results = [
      {
        source: 'foo.css',
        warnings: [
          {line: 20, rule: 'derp', text: 'hi'}
        ]
      }
    ]
    const warnings = utils.gatherWarnings(results)
    expect(warnings).toHaveLength(1)
    expect(warnings[0].source).toBe(results[0].source)
  })

  it('sets links.file', () => {
    const results = [
      {
        source: 'foo.css',
        warnings: [
          {line: 20, rule: 'derp', text: 'hi'}
        ]
      }
    ]
    const warnings = utils.gatherWarnings(results)
    expect(warnings[0].links).toEqual({
      file: `${thisRepoURL}/blob/abc123/foo.css`,
      line: `${thisRepoURL}/blob/abc123/foo.css#L20`,
      rule: `https://stylelint.io/user-guide/rules/derp`
    })
  })
})

describe('getHeadRef()', () => {
  it(`spawns "git show-ref -s HEAD"`, () => {
    const ref = utils.getHeadRef()
    expect(spawnSync).toHaveBeenCalledWith('git', ['show-ref', '-s', 'HEAD'], {encoding: 'utf8'})
    expect(ref).toEqual('abc123')
  })
})

describe('getRepoURL()', () => {
  it('works here', () => {
    expect(utils.getRepoURL()).toEqual(thisRepoURL)
  })
})

describe('stripCwd()', () => {
  it('removes process.cwd() by default', () => {
    expect(utils.stripCwd(`${process.cwd()}/foo.css`)).toEqual('foo.css')
  })

  it('removes the provided cwd', () => {
    const cwd = `/tmp/blah`
    expect(utils.stripCwd(`${cwd}/foo.css`, cwd)).toEqual('foo.css')
  })

  it('does not remove a non-matching cwd', () => {
    expect(utils.stripCwd(`/usr/local/foo.css`)).toEqual('/usr/local/foo.css')
  })
})
