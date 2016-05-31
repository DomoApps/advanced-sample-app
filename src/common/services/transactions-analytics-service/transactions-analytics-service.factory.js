const Query = require('@domoinc/query');
const domo = require('ryuu.js');

module.exports = ngModule => {
  function transactionsAnalyticsService($q) {
    // Private variables
    const _queryBuilder = new Query();
    const _dataset = 'transactions';
    let _totals = undefined;

    // Public API here
    const service = {
      getTotals,
      getTopSellingItem/*,
      getTopGrossingItem*/
    };

    return service;

    //// Functions ////
    // returns info on the total no of transactions, total products sold, and total income
    function getTotals() {
      const deferred = $q.defer();

      if (typeof _totals !== 'undefined') {
        deferred.resolve(_totals);
        return deferred.promise; // early return to avoid wrapping the rest in an "else"
      }

      const query = _queryBuilder.select(['category', 'quantity', 'price', 'name']).
        groupBy('category', { price: 'sum', quantity: 'sum', name: 'count' });

      _queryDb(query).then(data => {
        let transactionCount = 0;
        let productsSold = 0;
        let income = 0;
        for (let i = 0; i < data.length; i++) {
          transactionCount += data[i].name; //confusing, I know...
          productsSold += data[i].quantity;
          income += data[i].price;
        }
        _totals = {
          transactionCount,
          productsSold,
          income
        };
        deferred.resolve(_totals);
      }, error => {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    // todo: return all top selling?
    function getTopSellingItem(date) {
      const queryBuilder = new Query();
      const query = queryBuilder.select(['name', 'price', 'quantity']).orderBy('quantity', 'desc').limit(10);

      domo.get(query.query('transactions')).then(data => {
        console.log(data);
      });

      if (date) {
        return;
      }
    }

     /*function getTopGrossingItem(date) {
      const queryBuilder = new Query();
      const query = queryBuilder.select(['name', 'total']).groupBy('name').orderBy('total', 'desc').limit(10);
      console.log(query.query('transactions'));

      domo.get(query.query('transactions')).then(data => {
        console.log(data);
      });

      if (date) {
        return;
      }
    }*/


    function _queryDb(query) {
      const deferred = $q.defer();
      domo.get(query.query(_dataset)).then(data => {
        deferred.resolve(data);
      }, error => {
        deferred.reject(error);
      });

      return deferred.promise;
    }
  }

  // inject dependencies here
  transactionsAnalyticsService.$inject = ['$q'];

  ngModule.factory('transactionsAnalyticsService', transactionsAnalyticsService);

  if (ON_TEST) {
    require('./transactions-analytics-service.factory.spec.js')(ngModule);
  }
};
