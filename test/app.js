'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('hugo:app', function() {
  before(function(done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({skipInstall: true})
      .withPrompts({someOption: true})
      .on('end', done);
  });

  it('creates files', function() {
    assert.file([
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.jscsrc',
      '.jshintrc',
      'config.toml',
      'config.prod.toml'
    ]);
  });
});
