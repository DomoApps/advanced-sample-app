import { attachAll } from '../../../../other/boilerplate-utils.js';

const ngModule = angular.module('da.desktop.home', []);

attachAll(require.context('./components', true, /\.(component|directive)\.js$/))(ngModule);
attachAll(require.context('./containers', true, /\.(component|directive)\.js$/))(ngModule);

ngModule.config(mainConfig);


function mainConfig($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    template: '<product-table-container></product-table-container>'
  }).state('transactions', {
    url: '/transactions',
    template: '<div></div>'
  });
}

mainConfig.$inject = ['$stateProvider'];


export default ngModule;
