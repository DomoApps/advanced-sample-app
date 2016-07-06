import { attachAll } from '../../../../other/boilerplate-utils.js';

const ngModule = angular.module('da.desktop.products', []);

attachAll(require.context('./components', true, /\.(component|directive)\.js$/))(ngModule);
attachAll(require.context('./containers', true, /\.(component|directive)\.js$/))(ngModule);

ngModule.config(productsConfig);


function productsConfig($stateProvider) {
  $stateProvider.state('products', {
    url: '/',
    template: '<inventory-container layout="column" flex></inventory-container>',
    order: 1
  });
}

productsConfig.$inject = ['$stateProvider'];


export default ngModule;
