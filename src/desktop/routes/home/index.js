import { attachAll } from '../../../../other/boilerplate-utils.js';

const ngModule = angular.module('da.desktop.home', []);

attachAll(require.context('./components', true, /\.(component|directive)\.js$/))(ngModule);
attachAll(require.context('./containers', true, /\.(component|directive)\.js$/))(ngModule);

ngModule.config(homeConfig);


function homeConfig($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    template: '<product-table-container></product-table-container>'
  });
}

homeConfig.$inject = ['$stateProvider'];


export default ngModule;
