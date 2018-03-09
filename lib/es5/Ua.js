var pkg = require('../../package.json');

var ua = pkg.name + '/' + pkg.version + ' Node.js/' + process.version;

exports.default = ua;
