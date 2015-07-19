var ProjectCreator = require('./lib/main');
var argv = require('minimist')(process.argv.slice(2));

ProjectCreator.run(argv._[0]);
