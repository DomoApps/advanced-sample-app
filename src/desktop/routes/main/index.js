import { attachAll } from '../../../../other/boilerplate-utils.js';

const ngModule = angular.module('da.desktop.main', []);

attachAll(require.context('./components', true, /\.(component|directive)\.js$/))(ngModule);
attachAll(require.context('./containers', true, /\.(component|directive)\.js$/))(ngModule);

ngModule.config(mainConfig);


function mainConfig($stateProvider) {
  $stateProvider.state('products', {
    url: '/',
    template: '<inventory-container category-filter="$ctrl.categoryFilters"></inventory-container>',
    order: 1
  }).state('transactions', {
    url: '/transactions',
    template: '<transactions-container></transactions-container>',
    parentName: 'products' //not actually the parent, but I wanted it to swipe sideways
  });
}

mainConfig.$inject = ['$stateProvider'];


export default ngModule;
