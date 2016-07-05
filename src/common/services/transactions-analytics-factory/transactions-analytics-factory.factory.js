const Query = require('@domoinc/query');
const domo = require('ryuu.js');
// moment library for date formatting
// needs to be instantiated with moment().format()
const moment = require('moment');
moment().format();

module.exports = ngModule => {
  function transactionsAnalyticsFactory(SAMPLE_APP) {
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
     * @param  {string} categoryFilters
     * @param  {string or object or undefined} dateRangeFilter - either 'year' for last year, 'quarter'
     **for same quarter last year, {start: X, end: X} where X is parseable by moment, or undefined
     * @return {promise} - promise returning object of format {transactionCount: X, productsSold: X, income: X}
     */
    function getTotals(categoryFilters, dateRangeFilter) {
      let query = (new Query()).select(['category', 'quantity', 'total', 'name', 'date']);
      query = _applyCategoryFilter(query, categoryFilters);
      if (typeof dateRangeFilter !== 'undefined') {
        query = _applyDateRangeFilter(query, dateRangeFilter);
      }
      query.groupBy('category', { total: 'sum', quantity: 'sum', name: 'count' });
      return domo.get(query.query(_dataset)).then(data => {
        return data.reduce((accumulated, currentRow) => {
          accumulated.transactionCount += currentRow.name; // confusing, I know...
          accumulated.productsSold += currentRow.quantity;
          accumulated.income += currentRow.total;
          return accumulated;
        }, { transactionCount: 0, productsSold: 0, income: 0 });
      });
    }

    /**
     * gets data on transactions per dateGrain (month, week, etc...)
     * @param  {string/undefined} dateGrain       String of either 'month', 'week', or 'quarter'
     * @param  {string} categoryFilters
     * @param  {object/string/undefined} dateRangeFilter 'year' for last year, 'quarter' for this quarter last year, { start: string, end: string }, or undefined
     * @return {array[objects]}                 array of format [{date: string, total: number, quantity: number, category: number}, ...]
     */
    function getTransactionsPerX(dateGrain, categoryFilters, dateRangeFilter) {
      let query = (new Query()).select(['date', 'total', 'quantity', 'category']);
      query = _applyCategoryFilter(query, categoryFilters);
      if (typeof dateRangeFilter !== 'undefined') {
        query = _applyDateRangeFilter(query, dateRangeFilter);
      }
      if (typeof dateGrain !== 'undefined') {
        query = _applyDateGrainFilter(query, { column: 'date', grain: dateGrain, accumulator: { category: 'count' } });
      }
      return domo.get(query.query(_dataset)).then(data => {
        return data.map(row => {
          row.date = row['Calendar' + _grainMap[dateGrain]];
          return row;
        });
      });
    }

    function _applyDateGrainFilter(query, dateGrain) {
      if (typeof dateGrain.accumulator !== 'undefined') {
        query.dateGrain(dateGrain.column, dateGrain.grain, dateGrain.accumulator);
      } else {
        query.dateGrain(dateGrain.column, dateGrain.grain);
      }
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
      if (typeof dateRangeFilter.start !== 'undefined' && typeof dateRangeFilter.end !== 'undefined') {
        query.where('date').gte(moment(dateRangeFilter.start).toISOString());
        query.where('date').lte(moment(dateRangeFilter.end).toISOString());
      }
      return query;
    }
  }

  // inject dependencies here
  transactionsAnalyticsFactory.$inject = ['SAMPLE_APP'];

  ngModule.factory('transactionsAnalyticsFactory', transactionsAnalyticsFactory);

  if (ON_TEST) {
    require('./transactions-analytics-factory.factory.spec.js')(ngModule);
  }
};
