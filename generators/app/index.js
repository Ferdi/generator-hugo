'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var generator = require('yeoman-generator');

module.exports = generator.Base.extend({
  initializing: function() {
    this.props = {};
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
  },

  prompting: function() {
    var done = this.async();

    var prompts = [{
      name: 'projectName',
      message: 'What is the name of your project?',
      store: true
    }, {
      name: 'projectDescription',
      message: 'Describe your project',
      store: true
    }, {
      name: 'projectURL',
      message: chalk.red('If you are using GHPages use username.github.io') +
        '\nWhat will the URL for your project be?',
      store: true
    }, {
      name: 'authorName',
      message: 'What\'s your name?',
      store: true
    }, {
      name: 'authorEmail',
      message: 'What\'s your email?',
      store: true
    }, {
      name: 'authorBio',
      message: 'Write a short description about yourself',
      store: true
    }, {
      name: 'authorTwitter',
      message: 'Your Twitter handle',
      store: true,
    }, {
      name: 'uploading',
      type: 'list',
      message: 'How do you want to upload your site?',
      choices: ['Amazon S3', 'Rsync', 'Github Pages', 'None'],
      store: true
    }, {
      name: 'permalinks',
      type: 'list',
      message: 'Permalink style' + (chalk.red(
                     '\n  pretty: /:year/:month/:day/:title/' +
                     '\n  date:   /:year/:month/:day/:title.html' +
                     '\n  none:   /:categories/:title.html')) + '\n',
      choices: ['pretty', 'date', 'none'],
      store: true
    }];

    this.prompt(prompts, function(props) {
      this.props = _.extend(this.props, props);

      done();
    }.bind(this));
  },

  writing: function() {
    var pkgJSONFields = {
      name: _.kebabCase(this.props.projectName),
      version: '0.0.0',
      description: this.props.projectDescription,
      homepage: this.props.projectURL,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail
      }
    };

    this.fs.writeJSON('package.json', _.extend(pkgJSONFields, this.pkg));
  },

  default: function() {
    this.composeWith('hugo:dotfiles', {}, {
      local: require.resolve('../dotfiles')
    });

    this.composeWith('hugo:gulp', {
      options: {
        uploading: this.props.uploading
      }
    }, {
      local: require.resolve('../gulp')
    });

    this.composeWith('hugo:hugo', {
      options: {
        projectName: this.props.projectName,
        projectDescription: this.props.projectDescription,
        projectURL: this.props.projectURL,
        authorName: this.props.authorName,
        authorEmail: this.props.authorEmail,
        authorBio: this.props.authorBio,
        authorTwitter: this.props.authorTwitter,
        permalinks: this.props.permalinks
      }
    }, {
      local: require.resolve('../hugo')
    });
  },

  install: function() {
    this.installDependencies();
  }
});
