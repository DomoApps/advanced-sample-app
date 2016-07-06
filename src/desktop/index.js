require('domo-bits');
require('da-bits');
require('angular-material');
require('./desktop.css');

import angular from 'angular';
import { attachAll, getNgModuleNames } from '../../other/boilerplate-utils.js';

const ngDependencies = [
  'ui.router',
  'ngAnimate',
  require('../common').name,
  // Add additional external Angular dependencies here
  'domobits',
  'dabits',
  'ngMaterial'
];

ngDependencies.push.apply(ngDependencies, getNgModuleNames(require.context('./routes', true, /index\.js$/)));


const ngModule = angular.module('da.desktop', ngDependencies)
  .constant('$', require('jquery'))
  .constant('d3', require('d3'))
  .constant('_', require('lodash'))
  .constant('SAMPLE_APP', {
    E_CAT_FILTER_CHANGE: 'filters:change',  // event string for category filter change
    DEFAULT_CATEGORY: 'All Categories'
  });

attachAll(require.context('./components', true, /\.(component|directive)\.js$/))(ngModule);
attachAll(require.context('./containers', true, /\.(component|directive)\.js$/))(ngModule);

ngModule.config(require('./desktop.config.js'))
  .run(require('./desktop.init.js'));
