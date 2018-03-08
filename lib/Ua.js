const pkg = require('../package.json');

const ua = `${pkg.name}/${pkg.version} Node.js/${process.version}`;

export default ua
