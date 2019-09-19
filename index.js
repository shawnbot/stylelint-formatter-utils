const {spawnSync} = require('child_process')
const getOriginURL = require('remote-origin-url').sync
const parseGitURL = require('git-url-parse')
const markdown = require('./markdown')

module.exports = {
  getHeadRef,
  getRepoURL,
  stripCwd,
  Table,
  markdown
}

function getHeadRef() {
  const {stdout} = spawnSync('git', ['show-ref', '-s', 'HEAD'], {encoding: 'utf8'})
  return stdout.trim()
}

function getRepoURL() {
  const remoteURL = getOriginURL()
  const {name, owner} = parseGitURL(remoteURL)
  return `https://github.com/${name}/${owner}`
}

function stripCwd(path, cwd) {
  const prefix = cwd || process.cwd()
  return path.startsWith(prefix) ? path.substr(prefix.length + 1) : path
}
