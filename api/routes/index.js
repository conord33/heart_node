// Convenience function for loading a whole folder

var files = {};

require('fs').readdirSync(__dirname + '/').forEach(function (file) {
  files[file.split('.')[0]] = require('./' + file);
});

module.exports = files;
