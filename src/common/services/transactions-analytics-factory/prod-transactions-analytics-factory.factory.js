module.exports = ngModule => {
  function prodTransactionsAnalyticsFactory(SAMPLE_APP) {
    const Query = require('@domoinc/query');
    const domo = require('ryuu.js');
    // moment library for data formatting
    // needs to be instantiated with moment().format()
    const moment = require('moment');
    moment().format();

    // Private variables
    const _dataset = 'transactions';
    const _grainMap = {
      month: 'Month',
      week: 'Week',
      quarter: 'Quarter'
    };

    // Public API here
    const service = {
      getTotals,
      getTransactionsPerX
    };

    return service;

    //// Functions ////
    /**
     * gets useful totals for a certain category or date range
     *
     * @param  {string} categoryFilter
     * @param  {string or object or undefined} dateRangeFilter - either 'year' for last year, 'quarter'
     **for same quarter last year, or undefined
     * @return {promise} - promise returning object of format {transactionCount: X, productsSold: X, income: X}
     */
    function getTotals(categoryFilter, dateRangeFilter) {
      let query = (new Query()).select(['category', 'quantity', 'total', 'name', 'date']);
      query = _applyCategoryFilter(query, categoryFilter);
      if (typeof dateRangeFilter !== 'undefined') {
        query = _applyDateRangeFilter(query, dateRangeFilter);
      }
      query.groupBy('category', { total: 'sum', quantity: 'sum', name: 'count' });
      return domo.get(query.query(_dataset)).then(data => {
        return data.reduce((accumulated, currentRow) => {
          // domo.get doesn't allow us to create 'virtual' rows yet, so we just reuse the rows we don't need
          accumulated.transactionCount += currentRow.name;
          accumulated.productsSold += currentRow.quantity;
          accumulated.income += currentRow.total;
          return accumulated;
        }, { transactionCount: 0, productsSold: 0, income: 0 });
      });
    }

    /**
     * gets data on transactions per dateGrain (month, week, etc...)
     * @param  {string} categoryFilter
     * @param  {string/undefined} optDateGrain       String of either 'month', 'week', or 'quarter'. defaults to month
     * @param  {object/string/undefined} dateRangeFilter 'year' for last year, 'quarter' for this quarter last year, or undefined
     * @return {array[objects]}                 array of format [{date: string, total: number, quantity: number, category: number}, ...]
     */
    function getTransactionsPerX(categoryFilter, optDateGrain, optDateRange) {
      let query = (new Query()).select(['date', 'total', 'quantity', 'category']);
      const dateGrain = typeof optDateGrain !== 'undefined' ? optDateGrain : 'month';
      query = _applyCategoryFilter(query, categoryFilter);
      if (typeof optDateRange !== 'undefined') {
        query = _applyDateRangeFilter(query, optDateRange);
      }
      query = _applyDateGrainFilter(query, dateGrain);
      return domo.get(query.query(_dataset)).then(data => {
        return data.map(row => {
          row.date = row['Calendar' + _grainMap[dateGrain]];
          return row;
        });
      });
    }

    function _applyDateGrainFilter(query, dateGrain) {
      query.dateGrain('date', dateGrain, { category: 'count' });
      return query;
    }

    function _applyCategoryFilter(query, categoryFilter) {
      if (categoryFilter !== SAMPLE_APP.DEFAULT_CATEGORY) {
        query.where('category').in([categoryFilter]);
      }
      return query;
    }

    function _applyDateRangeFilter(query, dateRangeFilter) {
      if (dateRangeFilter === 'year') {
        query.previousPeriod('date', 'year');
      }
      if (dateRangeFilter === 'quarter') {
        // this quarter last year
        query.where('date').gte(moment().subtract(1, 'years').startOf('quarter').toISOString());
        query.where('date').lte(moment().subtract(1, 'years').endOf('quarter').toISOString());
      }
      return query;
    }
  }

  prodTransactionsAnalyticsFactory.$inject = ['SAMPLE_APP'];

  ngModule.factory('prodTransactionsAnalyticsFactory', prodTransactionsAnalyticsFactory);
};
