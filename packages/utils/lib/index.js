const log = require('./log');
const locale = require('./locale');
const npm = require('./npm');
const package = require('./package');
const exec = require('./exec');
const inquirer = require('./inquirer');
const request = require('./request');

module.exports = {
    log,
    locale,
    npm,
    Package: package,
    exec,
    inquirer,
    request
};