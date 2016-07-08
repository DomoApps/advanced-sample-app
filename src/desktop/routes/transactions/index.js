import { attachAll } from '../../../../other/boilerplate-utils.js';

const ngModule = angular.module('da.desktop.transactions', []);

attachAll(require.context('./components', true, /\.(component|directive)\.js$/))(ngModule);
attachAll(require.context('./containers', true, /\.(component|directive)\.js$/))(ngModule);

ngModule.config(transactionsConfig);


function transactionsConfig($stateProvider) {
  $stateProvider.state('transactions', {
    url: '/transactions',
    template: '<transactions-container category-filter="$ctrl.categoryFilters"></transactions-container>'
  });
}

transactionsConfig.$inject = ['$stateProvider'];


export default ngModule;
