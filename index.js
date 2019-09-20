const {spawnSync} = require('child_process')
const getOriginURL = require('remote-origin-url').sync
const parseGitURL = require('git-url-parse')

module.exports = {
  gatherWarnings,
  getHeadRef,
  getRepoURL,
  stripCwd,
  Table: require('./table'),
  markdown: require('./markdown')
}

function gatherWarnings(results, options = {}) {
  const {cwd = process.cwd(), headRef = getHeadRef() || 'master', repoURL = getRepoURL()} = options

  const flat = []
  for (const {source, warnings} of results) {
    for (const warning of warnings) {
      const fileURL = `${repoURL}/blob/${headRef}/${source}`
      warning.source = stripCwd(source, cwd)
      warning.links = {
        file: fileURL,
        line: `${fileURL}#L${warning.line}`,
        rule: `https://stylelint.io/user-guide/rules/${warning.rule}`
      }
      flat.push(warning)
    }
  }
  return flat
}

function getHeadRef() {
  const {stdout} = spawnSync('git', ['show-ref', '-s', 'HEAD'], {encoding: 'utf8'})
  return stdout.trim()
}

function getRepoURL() {
  const remoteURL = getOriginURL()
  const {name, owner} = parseGitURL(remoteURL)
  return `https://github.com/${owner}/${name}`
}

function stripCwd(path, cwd) {
  const prefix = cwd || process.cwd()
  return path.startsWith(prefix) ? path.substr(prefix.length + 1) : path
}
