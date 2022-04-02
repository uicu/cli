const log = require('./log');
const locale = require('./locale');
const npm = require('./npm');
const package = require('./package');

module.exports = {
    log,
    locale,
    npm,
    Package: package
};