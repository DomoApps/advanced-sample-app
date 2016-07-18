module.exports = ngModule => {
  function devTransactionsAnalyticsFactory($q, SAMPLE_APP) {
    // moment library for date formatting
    // needs to be instantiated with moment().format()
    const moment = require('moment');
    moment().format();

    const sampleTransactions = require('./sample-transactions.json');

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
      let totals = sampleTransactions;
      if (categoryFilter !== SAMPLE_APP.DEFAULT_CATEGORY) {
        totals = totals.filter(transaction => { return transaction.category === categoryFilter; });
      }
      const lastYear = moment().subtract(1, 'years');
      const beginQuarter = moment().subtract(1, 'years').startOf('quarter');
      const endQuarter = moment().subtract(1, 'years').endOf('quarter');
      totals = totals.filter(transaction => {
        if (dateRangeFilter === 'year') {
          return moment(transaction.date).isSame(lastYear, 'year');
        }
        if (dateRangeFilter === 'quarter') {
          return moment(transaction.date).isBetween(beginQuarter, endQuarter, 'day', '[]');
        }
        return true;
      });
      return $q.resolve(totals.reduce((accumulated, currentRow) => {
        accumulated.transactionCount++;
        accumulated.productsSold += currentRow.quantity;
        accumulated.income += currentRow.total;
        return accumulated;
      }, { transactionCount: 0, productsSold: 0, income: 0 }));
    }

    /**
     * gets data on transactions per dateGrain (month, week, etc...)
     * @param  {string} categoryFilter
     * @param  {string/undefined} optDateGrain       String of either 'month', 'week', or 'quarter'. defaults to month
     * @param  {object/string/undefined} dateRangeFilter 'year' for last year, 'quarter' for this quarter last year, or undefined
     * @return {array[objects]}                 array of format [{date: string, total: number, quantity: number, category: number}, ...]
     */
    function getTransactionsPerX(categoryFilter, optDateGrain, optDateRange) {
      // because this is a sample app we will modify the JSON ourselves
      // readability was chosen over performance
      return $q(resolve => {
        let transactions = sampleTransactions;
        const dateGrain = (typeof optDateGrain !== 'undefined' ? optDateGrain : 'month');
        transactions = _applyCategoryFilter(transactions, categoryFilter);
        transactions = transactions.map(transaction => {
          // clone object so we don't mutate our sampleTransactions and convert string dates to moments
          return Object.assign({}, transaction, { date: moment(transaction.date) });
        });
        if (typeof optDateRange !== 'undefined') {
          transactions = _applyDateRangeFilter(transactions, optDateRange);
        }
        transactions.sort((a, b) => {
          return a.date - b.date;
        });
        transactions = _applyDateGrainFilter(transactions, dateGrain);
        transactions = transactions.map(transaction => {
          transaction.date = transaction.date.format('YYYY-MM-DD');
          return transaction;
        });
        resolve(transactions);
      });
    }

    function _applyDateGrainFilter(query, dateGrain) {
      return query.reduce((accumulated, currentRow) => {
        // mutates currentRow and accumulated
        if (accumulated.length === 0) {
          currentRow.category = 1;
          accumulated.push(currentRow);
          return accumulated;
        }

        const tail = accumulated.pop();
        // create new moment objects because moment methods are mutating
        const grainStart = moment(tail.date.startOf(dateGrain));
        const grainEnd = moment(tail.date.endOf(dateGrain));
        if (currentRow.date.isBetween(grainStart, grainEnd, 'day', '[]')) {
          tail.category++;
          tail.quantity += currentRow.quantity;
          tail.total += currentRow.total;
          accumulated.push(tail);
          return accumulated;
        }

        currentRow.category = 1;
        accumulated.push(tail, currentRow);
        return accumulated;
      }, []);
    }

    function _applyCategoryFilter(query, categoryFilter) {
      if (categoryFilter !== SAMPLE_APP.DEFAULT_CATEGORY) {
        return query.filter(transaction => {
          return transaction.category === categoryFilter;
        });
      }
      return query;
    }

    function _applyDateRangeFilter(query, dateRangeFilter) {
      if (dateRangeFilter === 'year') {
        const lastYear = moment().subtract(1, 'years');
        return query.filter(transaction => {
          return transaction.date.isSame(lastYear, 'year');
        });
      }
      if (dateRangeFilter === 'quarter') {
        const beginQuarter = moment().subtract(1, 'years').startOf('quarter');
        const endQuarter = moment().subtract(1, 'years').endOf('quarter');
        return query.filter(transaction => {
          return transaction.date.isBetween(beginQuarter, endQuarter, 'day', '[]');
        });
      }
      return query;
    }
  }

  devTransactionsAnalyticsFactory.$inject = ['$q', 'SAMPLE_APP'];

  ngModule.factory('devTransactionsAnalyticsFactory', devTransactionsAnalyticsFactory);
};
