module.exports = ngModule => {
  // todo: ask andrew if there are better ways
  // todo: split into components
  require('./transactions-container.component.css');
  const SummaryNumber = require('@domoinc/summary-number');
  require('@domoinc/ca-icon-trends-with-text');
  require('@domoinc/ca-stats-circle');

  ngModule.component('transactionsContainer', {
    template: require('./transactions-container.component.html'),
    controller: transactionsContainerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      categoryFilter: '<' // a string of the category to filter by
      // Outputs should use & bindings.
    }
  });

  function transactionsContainerCtrl(transactionsAnalyticsService, $q, daEvents, daFilters) {
    const ctrl = this;

    let _categoryFilter = undefined;
    const _dateRangeCustomFilter = {};
    const summary = new SummaryNumber();
    let _datepickerIsCustom = false;
    const MILLISECONDS_PER_MINUTE = 60000;
    const chartTypeToDataset = {
      transactionCount: 'transactionCountLineChartData',
      productsSold: 'productsSoldLineChartData',
      income: 'incomeLineChartData'
    };

    // todo: split into private vars
    ctrl.$onInit = $onInit;
    ctrl.$onChanges = $onChanges;
    ctrl.displayLineChart = displayLineChart;
    ctrl.granularityDropdownSelect = granularityDropdownSelect;
    ctrl.dateRangeDropdownSelect = dateRangeDropdownSelect;
    ctrl.onStartDatepickerChange = onStartDatepickerChange;
    ctrl.onEndDatepickerChange = onEndDatepickerChange;
    ctrl.loading = true;
    ctrl.transactionCountLineChartData = undefined;
    ctrl.productsSoldLineChartData = undefined;
    ctrl.incomeLineChartData = undefined;
    ctrl.totalincome = undefined;
    ctrl.productsSold = undefined;
    ctrl.transactionCount = undefined;
    ctrl.widgetData = undefined;
    ctrl.customStartDate = undefined;
    ctrl.customEndDate = undefined;
    ctrl.earliestTransaction = undefined;
    ctrl.latestTransaction = undefined;
    ctrl.dateLowerBound = undefined;
    ctrl.dateUpperBound = undefined;
    ctrl.activePill = 'totalIncomePill';
    ctrl.pills = [];
    ctrl.lineChartDataKey = 'incomeLineChartData';
    ctrl.lineChartData = undefined;
    ctrl.granularityDropdownItems = [
      {
        name: 'Month',
        value: 'month'
      },
      {
        name: 'Week',
        value: 'week'
      },
      {
        name: 'Quarter',
        value: 'quarter'
      }
    ];
    ctrl.granularityDropdownSelectedItem = ctrl.granularityDropdownItems[0];
    ctrl.dateRangeDropdownItems = [
      {
        // todo: set to be null?
        name: 'All Time',
        value: 'all'
      },
      {
        name: 'Last Year',
        value: 'year'
      },
      {
        name: 'This Quarter Last Year',
        value: 'quarter'
      },
      {
        name: 'Custom',
        value: 'custom'
      }
    ];
    ctrl.dateRangeDropdownSelectedItem = ctrl.dateRangeDropdownItems[0];


    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      _refreshData().then(() => {
        // instantiate start and end dates so db-datepicker's validator doesn't get mad at us
        ctrl.customStartDate = ctrl.earliestTransaction;
        ctrl.customEndDate = ctrl.latestTransaction;
        console.log('date, ', ctrl.customStartDate, ctrl.customEndDate);
      });
    }

    function $onChanges(changes) {
      if (typeof changes.categoryFilter !== 'undefined') {
        if (changes.categoryFilter.currentValue !== 'All') {
          _categoryFilter = [changes.categoryFilter.currentValue];
        } else {
          _categoryFilter = undefined;
        }
        _refreshData();
      }
    }

    function _refreshData() {
      ctrl.loading = true;
      const dateRangeFilter = _datepickerIsCustom ? _dateRangeCustomFilter : ctrl.dateRangeDropdownSelectedItem.value;
      return $q.all([transactionsAnalyticsService.getTotals(_categoryFilter, dateRangeFilter),
        transactionsAnalyticsService.getTransactionsPerX(ctrl.granularityDropdownSelectedItem.value, _categoryFilter, dateRangeFilter),
        transactionsAnalyticsService.getEarliestTransaction(),
        transactionsAnalyticsService.getLatestTransaction()]).then(data => {
          ctrl.transactionCountLineChartData = _formatDataForLineChart('Transactions', data[1], 'category');
          ctrl.productsSoldLineChartData = _formatDataForLineChart('Products Sold', data[1], 'quantity');
          ctrl.incomeLineChartData = _formatDataForLineChart('Income', data[1], 'total');

          ctrl.transactionCount = summary.summaryNumber(data[0].transactionCount);
          ctrl.totalIncome = '$' + summary.summaryNumber(data[0].income);
          ctrl.productsSold = summary.summaryNumber(data[0].productsSold);

          ctrl.earliestTransaction = _parseDate(data[2][0].date);
          ctrl.latestTransaction = _parseDate(data[3][0].date);

          ctrl.lineChartData = ctrl[ctrl.lineChartDataKey];

          ctrl.loading = false;
        });
    }

    function onStartDatepickerChange() {
      _datepickerIsCustom = true;
      _dateRangeCustomFilter.start = ctrl.customStartDate;
      console.log('date', ctrl.customStartDate);
      if (typeof _dateRangeCustomFilter.end !== 'undefined') {
        _refreshData();
      }
    }

    function onEndDatepickerChange() {
      _datepickerIsCustom = true;
      _dateRangeCustomFilter.end = ctrl.customEndDate;
      if (typeof _dateRangeCustomFilter.start !== 'undefined') {
        _refreshData();
      }
    }

    function granularityDropdownSelect(item) {
      ctrl.granularityDropdownSelectedItem = item;
      _refreshData();
    }

    function dateRangeDropdownSelect(item) {
      _datepickerIsCustom = false;
      ctrl.dateRangeDropdownSelectedItem = item;
      // don't run the update if we still need to choose a custom time
      if (item.value !== 'custom') {
        _refreshData();
      }
    }

    function displayLineChart(chartType) {
      ctrl.lineChartDataKey = chartTypeToDataset[chartType];
      ctrl.lineChartData = ctrl[ctrl.lineChartDataKey];
    }


    function _formatDataForLineChart(title, salesData, columnName) {
      return salesData.map(row => {
        console.log('row', row);
        console.log('title', title);
        console.log('columnName', columnName);
        return [row.date, row[columnName], title];
      });
    }

    // utility function to convert our UTC times into locale
    // (we have to do this because db-datepicker displays dates in current locale. We can't change this.)
    function _parseDate(date) {
      const utcDate = new Date(date);
      return new Date(utcDate.getTime() + (utcDate.getTimezoneOffset() * MILLISECONDS_PER_MINUTE));
    }
  }

  // inject dependencies here
  transactionsContainerCtrl.$inject = ['transactionsAnalyticsService', '$q', 'daEvents', 'daFilters'];

  if (ON_TEST) {
    require('./transactions-container.component.spec.js')(ngModule);
  }
};
