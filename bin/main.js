#!/usr/bin/env node

// Dependencies
const program     = require('commander')
const Asset       = require('./components/helpers/asset')
const changelog   = require('./components/changelog.js')
const version     = require('./components/version.js')
const development = require('./components/development.js')
const compile     = require('./components/compile.js')
const bundle      = require('./components/bundle.js')
const i18n        = require('./components/i18n.js')

// Get callee assets
const package  = new Asset('package.json')
const manifest = new Asset('manifest.json')

// CLI interface
program
  .command('changelog')
  .description('Add changelog to the most recent tag')
  .action((output, options) => {
    changelog()
  });

program
  .command('version [output]')
  .description('Change version tags in json files')
  .action((output, options) => {
    version(manifest, package, output)
  });

program
  .command('development')
  .description('Run project in development environment')
  .action((output, options) => {
    development(package, manifest)
  });

program
  .command('compile [output]')
  .description('Compile project for release without app framework assets')
  .action((output = './build/', options) => {
    compile(package, output)
  });

program
  .command('bundle [output]')
  .description('Bundle project for app framework')
  .action((output = './bundle.zip', options) => {
    bundle(package, output)
  });

  program
    .command('i18n [master] [root]')
    .description('Generate translation files from master file')
    .action((master = './master.lang', root, options) => {
      i18n(master, root)
    });

// Parse node arguments
program.parse(process.argv);
