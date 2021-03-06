// Dependencies
const shell = require('shelljs')

// Git commands
const command = {

  hash: (index) =>
    `git rev-list --tags --skip=${index} --max-count=1 --no-walk`,

  tag: (hash) =>
    `git describe --abbrev=0 --tags ${hash}`,

  log: (newerTag, olderTag, format = '%h %s') =>
    `git log ${olderTag}..${newerTag} --pretty=format:"${format}"`,

  update: (tag, message) =>
    `git tag ${tag} ${tag} -f -m "${message}"`,

  publish: () =>
    `git push --tags`,

  user: () =>
    `git config user.name`,

  email: () =>
    `git config user.email`

}

// Sanitizer
const sanitize = (string) =>
  string.replace(/\n/g, '')

// Hash lookup
function* hash(index = 0, silent = true) {

  while(true) {
    const cmd = command.hash(index++)
    const val = shell.exec(cmd, { silent }).stdout

    yield sanitize(val)
  }

}

// Tag lookup
function* tag(index = 0, silent = true) {

  while(true) {
    const gen = hash(index++)
    const cmd = command.tag(gen.next().value)
    const val = shell.exec(cmd, { silent }).stdout

    yield sanitize(val)
  }

}

// Changelog
const changelog = (newerTag, olderTag, format = '%h %s', silent = true) => {

  const cmd = command.log(newerTag, olderTag)
  const val = shell.exec(cmd, { silent }).stdout

  // Escape double quotes
  return val.replace(/"/g, '\\"');

}

// Publish tags
const publish = (silent = true) => {

  const cmd = command.publish()
  const val = shell.exec(cmd, { silent })

  return val

}

// Username
const user = (silent = true) => {

  const username = shell.exec(command.user(), { silent })
  const email    = shell.exec(command.email(), { silent })

  return sanitize(`${username} <${email}>`)

}

// Message
const message = (tag, changelog, silent = true) => {

  const usr = user(silent)
  const cmd = command.update(tag, `Changelog\n\n${changelog}\n\n${usr}`)

  shell.exec(cmd, { silent })

}

// Export module
module.exports = { command, hash, tag, changelog, publish, user, message }
