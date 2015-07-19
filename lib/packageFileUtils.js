var prompt = require('prompt');
var path = require('path');

function setupPrompt() {
  prompt.start();
  prompt.message = '';
  prompt.delimiter = '';
}

function getAskMeFields(field) {
  if (json[field] === '<askme>') {
    return {
      name: field,
      description: field.cyan
    };
  }

  return null;
}

function getQuestionsArray(json) {
  return Object.keys(json)
    .forEach(getAskMeFields)
    .filter(function(element) {
      return element !== null;
    });
}

function readPackage(pathname) {
  var fullpath = path.resolve(pathname);
  var data = require(fullpath);
  var toAsk = getQuestionsArray(data);

  setupPrompt();
  prompt.get(toAsk, function(err, result) {
    if (err) console.error(err);
    
    toAsk.forEach(function(question) {
      console.log('%s: %s', question.name, result[question.name]);
    });
  });
}

module.exports = {
  parsePackageFile: readPackage 
};
