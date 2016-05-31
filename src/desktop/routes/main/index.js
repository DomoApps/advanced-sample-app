import { attachAll } from '../../../../other/boilerplate-utils.js';

const ngModule = angular.module('da.desktop.main', []);

attachAll(require.context('./components', true, /\.(component|directive)\.js$/))(ngModule);
attachAll(require.context('./containers', true, /\.(component|directive)\.js$/))(ngModule);

ngModule.config(mainConfig);


function mainConfig($stateProvider) {
  // IS DESTROYING THE DOM THE BEST WAY TO DO THIS?
  $stateProvider.state('products', {
    url: '/',
    template: '<product-table-container></product-table-container>'
  }).state('transactions', {
    url: '/transactions',
    template: '<transactions-container></transactions-container>'
  });
}

mainConfig.$inject = ['$stateProvider'];


export default ngModule;
