var argv = require('minimist')(process.argv.slice(2));

var src = argv._[0];
var dest = argv._[1];

console.log(src, dest);
