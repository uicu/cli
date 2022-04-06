const log = require('./log');
const locale = require('./locale');
const npm = require('./npm');
const package = require('./package');
const exec = require('./exec');

module.exports = {
    log,
    locale,
    npm,
    Package: package,
    exec
};