const Query = require('@domoinc/query');
const domo = require('ryuu.js');
const moment = require('moment');
moment().format();
// todo: YOU DON'T NEED Q.DEFER. Just return!
// flatten promise chains
module.exports = ngModule => {
  function transactionsAnalyticsService($q) {
    // Private variables
    const _dataset = 'transactions';
    let _topSelling = undefined;
    const _grainMap = {
      month: 'Month',
      week: 'Week',
      quarter: 'Quarter'
    };

    // Public API here
    const service = {
      getTotals,
      getGrossProfitPerX,
      getItemsSoldPerX,
      getTopSellingItem,
      getTransactionCountPerX/*,
      getTopGrossingItem*/
    };

    return service;

    //// Functions ////
    // returns info on the total no of transactions, total products sold, and total income
    function getTotals(categoryFilters, dateRangeFilter) {
      const deferred = $q.defer();
      const query = (new Query()).select(['category', 'quantity', 'total', 'name', 'date']);
      console.log('filters!', categoryFilters);
      if (typeof categoryFilters !== 'undefined' && categoryFilters.length > 0) {
        query.where('category').in(categoryFilters);
      }
      if (dateRangeFilter === 'year') {
        query.previousPeriod('date', 'year');
      }
      if (dateRangeFilter === 'quarter') {
        query.where('date').gte(moment().subtract(1, 'years').startOf('quarter').toISOString());
        query.where('date').lte(moment().subtract(1, 'years').endOf('quarter').toISOString());
      }
      query.groupBy('category', { total: 'sum', quantity: 'sum', name: 'count' });

      _queryDb(query).then(data => {
        let transactionCount = 0;
        let productsSold = 0;
        let income = 0;
        for (let i = 0; i < data.length; i++) {
          transactionCount += data[i].name; //confusing, I know...
          productsSold += data[i].quantity;
          income += data[i].total;
        }
        deferred.resolve({ transactionCount, productsSold, income });
      }, error => {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    // todo: return all top selling?
    function getTopSellingItem() {
      if (typeof _topSelling !== 'undefined') {
        return $q.resolve(_topSelling);
      }

      const deferred = $q.defer();
      const query = (new Query()).select(['name', 'price', 'quantity']).
        orderBy('quantity', 'desc').limit(10);

      _queryDb(query).then(data => {
        _topSelling = data;
        deferred.resolve(data);
      }, error => {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function getGrossProfitPerX(dateGrain, categoryFilters, dateRangeFilter) {
      const deferred = $q.defer();
      const query = (new Query()).select(['date', 'total']);
      if (typeof categoryFilters !== 'undefined' && categoryFilters.length > 0) {
        query.where('category').in(categoryFilters);
      }
      query.dateGrain('date', dateGrain);

      if (dateRangeFilter === 'year') {
        query.previousPeriod('date', 'year');
      }
      if (dateRangeFilter === 'quarter') {
        query.where('date').gte(moment().subtract(1, 'years').startOf('quarter').toISOString());
        query.where('date').lte(moment().subtract(1, 'years').endOf('quarter').toISOString());
      }

      _queryDb(query).then(data => {
        deferred.resolve(data.map(row => {
          row.date = row['Calendar' + _grainMap[dateGrain]];
          return row;
        }));
      }, error => {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function getItemsSoldPerX(dateGrain, categoryFilters, dateRangeFilter) {
      const deferred = $q.defer();
      // todo: memory leak issues?
      const query = (new Query()).select(['date', 'quantity']);
      if (typeof categoryFilters !== 'undefined' && categoryFilters.length > 0) {
        query.where('category').in(categoryFilters);
      }
      query.dateGrain('date', dateGrain);
      if (dateRangeFilter === 'year') {
        query.previousPeriod('date', 'year');
      }
      if (dateRangeFilter === 'quarter') {
        query.where('date').gte(moment().subtract(1, 'years').startOf('quarter').toISOString());
        query.where('date').lte(moment().subtract(1, 'years').endOf('quarter').toISOString());
      }

      _queryDb(query).then(data => {
        deferred.resolve(data.map(row => {
          row.date = row['Calendar' + _grainMap[dateGrain]];
          return row;
        }));
      }, error => {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function getTransactionCountPerX(dateGrain, categoryFilters, dateRangeFilter) {
      const deferred = $q.defer();
      const query = (new Query()).select(['date', 'quantity']);
      if (typeof categoryFilters !== 'undefined' && categoryFilters.length > 0) {
        query.where('category').in(categoryFilters);
      }
      query.dateGrain('date', dateGrain, { quantity: 'count' });

      if (dateRangeFilter === 'year') {
        query.previousPeriod('date', 'year');
      }
      if (dateRangeFilter === 'quarter') {
        query.where('date').gte(moment().subtract(1, 'years').startOf('quarter').toISOString());
        query.where('date').lte(moment().subtract(1, 'years').endOf('quarter').toISOString());
      }

      _queryDb(query).then(data => {
        deferred.resolve(data.map(row => {
          row.date = row['Calendar' + _grainMap[dateGrain]];
          return row;
        }));
      }, error => {
        deferred.reject(error);
      });

      return deferred.promise;
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
